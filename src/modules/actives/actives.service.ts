import { BadRequestException, Injectable } from '@nestjs/common';
import { MarketService } from './market.service';
import { CategoryEnum } from '../marks/marks.entity';
import { AxiosResponse } from 'axios';

@Injectable()
export class ActivesService {
  constructor(private marketService: MarketService) {}
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

      console.log(response.data);

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
}
