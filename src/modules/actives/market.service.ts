import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

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
}
