import { BadRequestException, Injectable } from '@nestjs/common';
import { MarketService } from './market.service';
import { CategoryEnum } from '../marks/marks.entity';
import { AxiosResponse } from 'axios';
import { CreateActiveRequestDto } from './dtos/CreateActiveRequestDto';
import { Actives } from './actives.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class ActivesService {
  constructor(
    @InjectRepository(Actives)
    private activeRepository: Repository<Actives>,
    private marketService: MarketService,
    private answersService: AnswersService,
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
}
