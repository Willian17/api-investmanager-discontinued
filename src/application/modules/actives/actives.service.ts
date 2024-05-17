import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CategoryEnum } from '../../../adapters/output/marks/marks.entity';
import { CreateActiveRequestDto } from './dtos/CreateActiveRequestDto';
import { Actives } from './actives.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from '../answers/answers.service';
import { ListTickersCryptoResponseDto } from './dtos/ListTickersCryptoResponseDto';
import { ListTickersResponseDto } from './dtos/ListTickersResponseDto';
import { MarksService } from '../marks/marks.service';
import { UpdateActiveRequestDto } from './dtos/UpdateActiveRequestDto';

export interface IActiveInfo {
  id: string;
  category: CategoryEnum;
  name: string;
  amount: string;
  currentValue: number;
  note: number;
  price: number;
}

@Injectable()
export class ActivesService {
  constructor(
    @InjectRepository(Actives)
    private activeRepository: Repository<Actives>,
    private marketService: MarketService,
    private answersService: AnswersService,
    private marksService: MarksService,
  ) {}
  async findTicker(ticker: string, category: string) {
    if (!ticker) {
      throw new BadRequestException(
        'Ticker é obrigatório!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!category) {
      throw new BadRequestException(
        'Categoria é obrigatório!',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      let response: any;
      if (category.toUpperCase() === CategoryEnum.CRIPTO_MOEDA) {
        response = await this.marketService.getAvailableTickerCrypto(ticker);
      } else {
        response = await this.marketService.getAvailableTicker(ticker);
      }

      const tickers = {
        tickers: Object.values(response.data).reduce(
          (acc: Array<any>, item: string) => {
            acc.push(...item);
            return acc;
          },
          [],
        ),
      };

      return tickers;
    } catch (error) {
      if (error?.response?.status === 404) {
        return {
          tickers: [],
        };
      }
      throw new BadRequestException(
        'Erro ao buscar ticker!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(body: CreateActiveRequestDto, idUser: string) {
    const activeExists = await this.activeRepository.findOne({
      where: { name: body.name, category: body.category, idUser },
    });
    if (activeExists) {
      throw new BadRequestException(
        'Ativo já cadastrado!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (body.category === CategoryEnum.RENDA_FIXA) {
      const active = this.activeRepository.create({
        name: body.name,
        amount: body.amount || 1,
        category: body.category,
        currentValue: body.currentValue,
        note: body.note,
        idUser,
      });

      const activeCreated = await this.activeRepository.save(active);
      return activeCreated;
    }
    if (body.category === CategoryEnum.CRIPTO_MOEDA) {
      const active = this.activeRepository.create({
        name: body.name,
        amount: body.amount,
        category: body.category,
        note: body.note,
        idUser,
      });

      const activeCreated = await this.activeRepository.save(active);
      return activeCreated;
    }

    if (!body.answers) {
      throw new BadRequestException(
        'Respostas é obrigatório!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const active = this.activeRepository.create({
      name: body.name,
      amount: body.amount,
      category: body.category,
      idUser,
    });

    const activeCreated = await this.activeRepository.save(active);
    const answers = body.answers.map((answer) => ({
      ...answer,
      idActive: activeCreated.id,
    }));
    await this.answersService.create(answers);
    return activeCreated;
  }
  async update(body: UpdateActiveRequestDto, idActive: string, idUser: string) {
    const activeExists = await this.activeRepository.findOne({
      where: { id: idActive, idUser },
    });
    if (!activeExists) {
      throw new NotFoundException('Ativo não encontrado!');
    }
    if (activeExists.category === CategoryEnum.RENDA_FIXA) {
      const active = {
        name: body.name,
        amount: body.amount || 1,
        currentValue: body.currentValue,
        note: body.note,
      };
      await this.activeRepository.update(idActive, active);

      return active;
    }
    if (activeExists.category === CategoryEnum.CRIPTO_MOEDA) {
      const active = {
        name: body.name,
        amount: body.amount,
        note: body.note,
      };
      await this.activeRepository.update(idActive, active);

      return active;
    }

    if (!body.answers) {
      throw new BadRequestException(
        'Respostas é obrigatório!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const active = {
      name: body.name,
      amount: body.amount,
    };

    await this.activeRepository.update(idActive, active);

    const answers = body.answers.map((answer) => ({
      ...answer,
      idActive,
    }));
    const answersToUpdate = answers.filter((answer) => answer.id);
    const answersToCreate = answers.filter((answer) => !answer.id);
    answersToUpdate.length &&
      (await this.answersService.update(answersToUpdate));

    answersToCreate.length &&
      (await this.answersService.create(answersToCreate));
    return {
      ...active,
      answers,
    };
  }

  async findById(idActive: string, idUser: string) {
    const active = await this.activeRepository.findOne({
      where: { id: idActive, idUser },
      relations: ['answers'],
    });
    if (!active) {
      throw new NotFoundException('Ativo não encontrado!');
    }
    return active;
  }

  async delete(idActive: string, idUser: string) {
    const activeExists = await this.activeRepository.findOne({
      where: { id: idActive, idUser },
    });
    if (!activeExists) {
      throw new NotFoundException('Ativo não encontrado!');
    }
    await this.activeRepository.delete(idActive);
  }

  async findAll(idUser: string) {
    const activesInfoComplete = await this.getActivesFromUser(idUser);

    const activesCalculates = await this.getMetricsActives(
      activesInfoComplete,
      idUser,
    );

    return activesCalculates;
  }

  async getActivesFromUser(idUser): Promise<IActiveInfo[]> {
    const activesDb = await this.activeRepository.query(
      `select ac.id, ac.category, ac.name, ac.amount, AC."currentValue", (case when ac.note is not NULL then ac.note else (COUNT(case when an.response then 1 end)) end) as note
    from actives ac
    left join answers an on an."idActive" = ac.id
    where ac."idUser" = $1
    group by ac.id
    order by ac.category;
    `,
      [idUser],
    );

    const filterRendaVariavel = (active) =>
      active.category !== CategoryEnum.RENDA_FIXA &&
      active.category !== CategoryEnum.CRIPTO_MOEDA;
    const filterCrypto = (active) =>
      active.category === CategoryEnum.CRIPTO_MOEDA;
    const getName = (active) => active.name;

    const activesRendaVariavelName = activesDb
      .filter(filterRendaVariavel)
      .map(getName);

    const activesCryptoName = activesDb.filter(filterCrypto).map(getName);

    const response =
      activesRendaVariavelName.length &&
      (await this.marketService.getInfoTickers(activesRendaVariavelName));

    const responseCrypto =
      activesCryptoName.length &&
      (await this.marketService.getInfoTickersCrypto(activesCryptoName));

    const activesInfoComplete = await this.getInfoActives(
      activesDb,
      response,
      responseCrypto,
    );

    return activesInfoComplete as any;
  }

  private async getInfoActives(
    actives: Actives[],
    response: ListTickersResponseDto[],
    responseCrypto: ListTickersCryptoResponseDto,
  ) {
    return await Promise.all(
      actives.map(async (active) => {
        const findActiveVariavel = response?.find(
          (info) => info.results[0].symbol === active.name,
        )?.results[0];

        const findActiveCrypto =
          responseCrypto?.BTCBRL?.code === active.name && responseCrypto;
        const infoActive = findActiveVariavel || findActiveCrypto;

        if (infoActive['currency'] && infoActive['currency'] !== 'BRL') {
          const priceCurrency = await this.marketService.getPriceCurrency(
            infoActive['currency'],
          );
          infoActive['regularMarketPrice'] =
            infoActive['regularMarketPrice'] * priceCurrency;
        }

        const price = infoActive['regularMarketPrice']
          ? +infoActive['regularMarketPrice']
          : infoActive['BTCBRL']
          ? +infoActive['BTCBRL'].bid
          : 0;
        const logoUrl = infoActive?.['logourl'];
        return {
          ...active,
          currentValue: +active.currentValue || +active.amount * +price,
          price: +active.currentValue || +price,
          note: +active.note || 0,
          logoUrl,
        };
      }),
    );
  }

  private async getMetricsActives(actives: IActiveInfo[], idUser: string) {
    const totalEquity = actives.reduce((acc, active) => {
      return acc + active.currentValue;
    }, 0);
    const sumNoteCategories = this.calculateNoteCategories(actives);
    const marks = await this.marksService.findAll(idUser);

    const activesInfo = actives.map((active) => {
      const recommend = active.note
        ? (active.note / sumNoteCategories[active.category]) *
          marks.find((mark) => mark.category === active.category)?.percentage
        : 0;

      const percentage = (active.currentValue / totalEquity) * 100;
      return {
        ...active,
        recommend,
        percentage,
      };
    });
    return {
      totalEquity,
      actives: activesInfo,
    };
  }

  private calculateNoteCategories(actives: IActiveInfo[]) {
    return Object.values(CategoryEnum).reduce((acc, category) => {
      const sumNote = actives
        .filter((active) => active.category === category)
        .reduce((acc, active) => {
          return acc + active.note;
        }, 0);
      acc[category] = sumNote;
      return acc;
    }, {});
  }
}
