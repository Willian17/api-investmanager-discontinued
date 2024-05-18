import { Injectable } from '@nestjs/common';
import { MarksService } from '../marks/marks.service';
import { ProvideInvestmentRequestDto } from './dtos/ProvideInvestmentRequestDto';
import { ActivesService, IActiveInfo } from '../actives/actives.service';
import { CategoryEnum } from '../../../domain/enum/CategoryEnum';

interface IContribuitionCategory {
  category: CategoryEnum;
  contributionAmount: number;
  totalEquity: number;
  markPercentageContribution: number;
}

@Injectable()
export class ContributeService {
  constructor(
    private activesService: ActivesService,
    private marksService: MarksService,
  ) {}

  async calculateProvide(body: ProvideInvestmentRequestDto, idUser: string) {
    const contributionValue = body.value;
    const actives = await this.activesService.getActivesFromUser(idUser);

    const totalEquity = actives.reduce((acc, active) => {
      return acc + active.currentValue;
    }, 0);

    const totalEquityEnd = totalEquity + contributionValue;

    const contributionCategory = await this.calculateContributionByCategory({
      idUser,
      actives,
      contributionValue,
      totalEquityEnd,
    });

    const activesContribution = this.calculateContributionActiveByCategory(
      actives,
      contributionCategory,
    );

    const totalContribution = activesContribution.reduce(
      (acc, active) => acc + active.contributionAmount,
      0,
    );

    const totalContributionCategory = Object.values(CategoryEnum)
      .map((category) => {
        const totalValue = activesContribution
          .filter((active) => active.category === category)
          .reduce((acc, active) => {
            return acc + active.contributionAmount;
          }, 0);

        return {
          category,
          contributionAmount: totalValue,
          percentage: (totalValue / totalContribution) * 100,
        };
      })
      .filter((category) => category.contributionAmount > 0);

    return {
      totalContribution,
      totalContributionCategory,
      actives: activesContribution,
    };
  }

  async calculateContributionByCategory({
    idUser,
    actives,
    contributionValue,
    totalEquityEnd,
  }: {
    idUser: string;
    actives: IActiveInfo[];
    contributionValue: number;
    totalEquityEnd: number;
  }): Promise<IContribuitionCategory[]> {
    const marks = await this.marksService.findAll(idUser);

    const categoryInfoComplete = Object.values(CategoryEnum).map((category) => {
      const totalValue = actives
        .filter((active) => active.category === category)
        .reduce((acc, active) => {
          return acc + active.currentValue;
        }, 0);

      const mark = marks.find((mark) => mark.category === category)?.percentage;
      const markValue = (mark / 100) * totalEquityEnd;
      return {
        category,
        markPercentage: mark,
        totalValue,
        markValue,
        contributionAmount: markValue - totalValue,
      };
    });

    const filterCategoryContribute = (category) =>
      category.contributionAmount > 0;

    const filterCategoryNegative = (category) =>
      category.contributionAmount < 0;

    const markPercentageContributeTotal = categoryInfoComplete
      .filter(filterCategoryContribute)
      .reduce((acc, category) => acc + category.markPercentage, 0);

    const negativeAmountValueCategoryTotal =
      Math.abs(
        categoryInfoComplete
          .filter(filterCategoryNegative)
          .reduce((acc, category) => acc + category.contributionAmount, 0),
      ) * 0.33;

    const contributionCategory = categoryInfoComplete
      .filter(filterCategoryContribute)
      .map((cat) => {
        const markPercentageContribution =
          cat.markPercentage / markPercentageContributeTotal;

        const contributionAmountByPercentage =
          markPercentageContribution *
          (contributionValue + negativeAmountValueCategoryTotal);

        const contributionAmount =
          contributionAmountByPercentage > cat.contributionAmount
            ? cat.contributionAmount
            : contributionAmountByPercentage;

        return {
          category: cat.category,
          contributionAmount,
          totalEquity: cat.totalValue + contributionAmount,
          markPercentageContribution,
        };
      });

    return contributionCategory;
  }

  calculateContributionActiveByCategory(
    actives: IActiveInfo[],
    contributionCategories: IContribuitionCategory[],
  ) {
    const activesContributeAmount = contributionCategories
      .map((category) => {
        //pegar ativos da categoria
        const activesByCategory = actives.filter(
          (active) => active.category === category.category,
        );
        const sumNoteActives = activesByCategory.reduce(
          (acc, active) => acc + +active.note,
          0,
        );
        // calcular o desbalanciamento
        const activesInfoComplete = activesByCategory.map((active) => {
          const markPercentage =
            active.note > 0 ? (active.note / sumNoteActives) * 100 : 0;
          const markValue = (markPercentage / 100) * category.totalEquity;
          return {
            ...active,
            markPercentage,
            markValue,
            contributionAmount: markValue - active.currentValue,
          };
        });

        // calcular quanto aportar em cada ativo
        let contributionActives = this.calculateContributionActives(
          activesInfoComplete,
          category,
        );
        // recalcular aporte caso tenha ativos não aportaveis
        if (
          contributionActives.some((active) => active.contributionAmount <= 0)
        ) {
          contributionActives = this.calculateContributionActives(
            contributionActives,
            category,
          );
        }

        let leftover =
          category.contributionAmount -
          contributionActives.reduce(
            (acc, active) => acc + active.contributionAmount,
            0,
          );
        // pegar sobra/resto do aporte da categoria e ir aportando em ativos dentro da categoria pela maior nota
        if (
          leftover > 0 &&
          contributionActives.some((active) => active.price <= leftover)
        ) {
          while (
            contributionActives.some((active) => active.price <= leftover)
          ) {
            const activesLowLeftover = contributionActives
              .filter((active) => active.price <= leftover)
              .sort((a, b) => b.note - a.note);
            activesLowLeftover.forEach((active) => {
              if (leftover - active.price >= 0) {
                leftover -= active.price;
                const index = contributionActives.findIndex(
                  (act) => act.id === active.id,
                );
                const activeExist = contributionActives[index];
                contributionActives[index] = {
                  ...activeExist,
                  quantity: activeExist.quantity + 1,
                  contributionAmount:
                    activeExist.contributionAmount + activeExist.price,
                };
              }
            });
          }
          // colocar a sobra em outra categoria pelo maior peso/meta
        } else if (leftover > 0) {
          const list = [...contributionCategories];

          const categories = list.sort(
            (a, b) =>
              b.markPercentageContribution - a.markPercentageContribution,
          );
          let index = 0;
          while (leftover > 0) {
            const cat = categories[index];
            if (cat.category != category.category) {
              cat.contributionAmount += leftover;
              leftover = 0;
            }
            index++;
          }
        }

        return contributionActives;
      })
      .reduce(
        (accumulator, activesContributeAmount) =>
          accumulator.concat(activesContributeAmount),
        [],
      );

    return activesContributeAmount;
  }

  calculateContributionActives(
    activesInfoComplete,
    category: IContribuitionCategory,
  ): any[] {
    // filtrar apenas os ativos aportaveis
    const filterActiveContribute = (active) => active.contributionAmount > 0;

    const markPercentageContributeTotal = activesInfoComplete
      .filter(filterActiveContribute)
      .reduce((acc, active) => acc + active.markPercentage, 0);

    const contributionActive = activesInfoComplete
      .filter(filterActiveContribute)
      .map((act) => {
        const markPercentageContribution =
          act.markPercentage / markPercentageContributeTotal;

        // valor do aporte
        const contributionAmount =
          markPercentageContribution * category.contributionAmount;

        const quantityContributeActive = contributionAmount / act.price;
        // categorias que não podem aportar fracionado
        if (
          act.category === CategoryEnum.ACOES_NACIONAIS ||
          act.category === CategoryEnum.FUNDOS_IMOBILIARIOS
        ) {
          return {
            ...act,
            quantity: quantityContributeActive | 0,
            contributionAmount: (quantityContributeActive | 0) * act.price,
          };
        }

        return {
          ...act,
          contributionAmount,
          quantity: quantityContributeActive,
        };
      });
    return contributionActive;
  }
}
