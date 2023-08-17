import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ListTickersResponseDto } from './dtos/ListTickersResponseDto';
import { AxiosResponse } from 'axios';
import { ListTickersCryptoResponseDto } from './dtos/ListTickersCryptoResponseDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MarketService {
  url = 'https://brapi.dev/api';
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAvailableTicker(ticker: string): Promise<AxiosResponse> {
    const key = `available-${ticker}`;
    const cachedData = await this.cacheManager.get<AxiosResponse>(key);
    if (cachedData) {
      return cachedData;
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.url}/available`, {
        params: { search: ticker },
      }),
    );
    await this.cacheManager.set(key, JSON.stringify(response));
    return response;
  }

  async getAvailableTickerCrypto(ticker: string) {
    const key = `crypto-available-${ticker}`;

    const cachedData = await this.cacheManager.get<string>(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.url}/v2/crypto/available`, {
        params: { search: ticker },
      }),
    );
    await this.cacheManager.set(key, JSON.stringify(response.data));

    return response;
  }

  async getInfoTickers(tickers: string[]): Promise<ListTickersResponseDto> {
    const key = `quote`;

    const cachedData = await this.cacheManager.get<string>(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await lastValueFrom(
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
    console.log(response.data);
    await this.cacheManager.set(key, JSON.stringify(response.data));

    return response.data;
  }

  async getInfoTickersCrypto(
    tickers: string[],
  ): Promise<ListTickersCryptoResponseDto> {
    const key = `crypto-quote-${tickers.join(',')}`;

    const cachedData = await this.cacheManager.get<string>(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await lastValueFrom(
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
    await this.cacheManager.set(key, JSON.stringify(response.data));

    return response.data;
  }
}
