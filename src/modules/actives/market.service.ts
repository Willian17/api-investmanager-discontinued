import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ListTickersResponseDto } from './dtos/ListTickersResponseDto';
import { AxiosResponse } from 'axios';
import { ListTickersCryptoResponseDto } from './dtos/ListTickersCryptoResponseDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MarketService {
  url = 'https://brapi.dev/api';
  urlCrypto = 'https://economia.awesomeapi.com.br/last';
  TTL_CRYPTO = 600;
  token = '';
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.token = this.configService.get('market.token');
  }

  async getAvailableTicker(ticker: string): Promise<AxiosResponse> {
    const key = `available-${ticker}`;
    const cachedData = await this.cacheManager.get<AxiosResponse>(key);
    if (cachedData) {
      return cachedData;
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.url}/available`, {
        params: { search: ticker, token: this.token },
      }),
    );
    await this.cacheManager.set(key, JSON.stringify(response.data));
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
        params: { search: ticker, token: this.token },
      }),
    );

    await this.cacheManager.set(key, JSON.stringify(response.data));

    return response;
  }

  async getPriceCurrency(currency: string) {
    const currencyValue = currency.toUpperCase();
    const key = `currency-${currencyValue}`;

    const cachedData = await this.cacheManager.get<string>(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.urlCrypto}/${currency}-BRL`),
    );

    const price = +response.data[`${currencyValue}BRL`].bid;
    await this.cacheManager.set(key, JSON.stringify(price));

    return price;
  }

  async getInfoTickers(tickers: string[]): Promise<ListTickersResponseDto[]> {
    const tickersReponse = Promise.all(
      tickers.map(async (ticker) => {
        const key = `quote-${ticker}`;

        const cachedData = await this.cacheManager.get<string>(key);

        if (cachedData) {
          return JSON.parse(cachedData) as ListTickersResponseDto;
        }

        const response = await lastValueFrom(
          this.httpService.get<ListTickersResponseDto>(
            `${this.url}/quote/${ticker}`,
            {
              params: {
                range: '1d',
                interval: '1d',
                fundamental: true,
                dividends: false,
                token: this.token,
              },
            },
          ),
        );

        await this.cacheManager.set(key, JSON.stringify(response.data));
        return response.data;
      }),
    );

    return tickersReponse;
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
        `${this.urlCrypto}/${tickers.join('')}-BRL`,
      ),
    );
    await this.cacheManager.set(
      key,
      JSON.stringify(response.data),
      this.TTL_CRYPTO,
    );

    return response.data;
  }
}
