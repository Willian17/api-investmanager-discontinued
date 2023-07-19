import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CategoryEnum } from '../marks/marks.entity';
import { AxiosResponse } from 'axios';
import { CreateActiveRequestDto } from './dtos/CreateActiveRequestDto';
import { Actives } from './actives.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from '../answers/answers.service';
import { ListTickersCryptoResponseDto } from './dtos/ListTickersCryptoResponseDto';
import { ListTickersResponseDto } from './dtos/ListTickersResponseDto';
import { MarksService } from '../marks/marks.service';
import { UpdateActiveRequestDto } from './dtos/UpdateActiveRequestDto';

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
      throw new BadRequestException('Ticker é obrigatório!');
    }
    if (!category) {
      throw new BadRequestException('Categoria é obrigatório!');
    }
    try {
      let response: AxiosResponse;
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
      if (error.response.status === 404) {
        return {
          tickers: [],
        };
      }
      throw new BadRequestException('Erro ao buscar ticker!');
    }
  }

  async create(body: CreateActiveRequestDto, idUser: string) {
    const activeExists = await this.activeRepository.findOne({
      where: { name: body.name, category: body.category, idUser },
    });
    if (activeExists) {
      throw new BadRequestException('Ativo já cadastrado!');
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
      throw new BadRequestException('Respostas é obrigatório!');
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
      throw new BadRequestException('Respostas é obrigatório!');
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

  async findAll(idUser: string) {
    const activesDb = await this.activeRepository.query(
      `select ac.id, ac.category, ac.name, ac.amount, AC."currentValue", (case when ac.note is not NULL then ac.note else (COUNT(case when an.response then 1 end)) end) as note
    from actives ac
    left join answers an on an."idActive" = ac.id
    where ac."idUser" = $1
    group by ac.id;`,
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

    const response = await this.marketService.getInfoTickers(
      activesRendaVariavelName,
    );
    const responseCrypto = await this.marketService.getInfoTickersCrypto(
      activesCryptoName,
    );

    const activesInfoComplete = this.getInfoActives(
      activesDb,
      response,
      responseCrypto,
    );

    const activesCalculates = await this.getMetricsActives(
      activesInfoComplete,
      idUser,
    );

    return activesCalculates;
  }

  private getInfoActives(
    actives: Actives[],
    response: AxiosResponse<ListTickersResponseDto, any>,
    responseCrypto: AxiosResponse<ListTickersCryptoResponseDto, any>,
  ) {
    return actives.map((active) => {
      const findActiveVariavel = response.data.results.find(
        (info) => info.symbol === active.name,
      );
      const findActiveCrypto = responseCrypto.data.coins.find(
        (info) => info.coin === active.name,
      );
      const infoActive = findActiveVariavel || findActiveCrypto;
      const price = infoActive?.regularMarketPrice;
      return {
        ...active,
        currentValue: +active.currentValue || +active.amount * +price,
        price: +active.currentValue || +price,
        note: +active.note || 0,
      };
    });
  }

  private async getMetricsActives(actives: Actives[], idUser: string) {
    const totalEquity = actives.reduce((acc, active) => {
      return acc + active.currentValue;
    }, 0);
    const sumNoteCategories = this.calculateNoteCategories(actives);
    const marks = await this.marksService.findAll(idUser);

    return actives.map((active) => {
      const recommend =
        (active.note / sumNoteCategories[active.category]) *
        marks.find((mark) => mark.category === active.category)?.percentage;
      const percentage = (active.currentValue / totalEquity) * 100;
      return {
        ...active,
        recommend,
        percentage,
      };
    });
  }

  private calculateNoteCategories(actives: Actives[]) {
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
