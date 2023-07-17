import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ListTickersResponseDto } from './dtos/ListTickersResponseDto';
import { AxiosResponse } from 'axios';
import { ListTickersCryptoResponseDto } from './dtos/ListTickersCryptoResponseDto';

@Injectable()
export class MarketService {
  url = 'https://brapi.dev/api';
  constructor(private httpService: HttpService) {}

  getAvailableTicker(ticker: string) {
    return lastValueFrom(
      this.httpService.get(`${this.url}/available`, {
        params: { search: ticker },
      }),
    );
  }

  getAvailableTickerCrypto(ticker: string) {
    return lastValueFrom(
      this.httpService.get(`${this.url}/v2/crypto/available`, {
        params: { search: ticker },
      }),
    );
  }

  getInfoTickers(
    tickers: string[],
  ): Promise<AxiosResponse<ListTickersResponseDto>> {
    return lastValueFrom(
      this.httpService.get<ListTickersResponseDto>(
        `${this.url}/quote/${tickers.join(',')}`,
        {
          params: {
            range: '1d',
            interval: '1d',
            fundamental: true,
            dividends: false,
          },
        },
      ),
    );
  }

  getInfoTickersCrypto(
    tickers: string[],
  ): Promise<AxiosResponse<ListTickersCryptoResponseDto>> {
    return lastValueFrom(
      this.httpService.get<ListTickersCryptoResponseDto>(
        `${this.url}/v2/crypto`,
        {
          params: {
            currency: 'BRL',
            coin: tickers.join(','),
          },
        },
      ),
    );
  }
}
