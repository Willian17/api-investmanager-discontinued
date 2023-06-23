import { Controller, Get, Request, Response } from '@nestjs/common';
import { ActivesService } from './actives.service';

@Controller('actives')
export class ActivesController {
  constructor(private activesService: ActivesService) {}

  @Get()
  async findSearchTicker(@Request() request, @Response() response) {
    const { ticker, category } = request.query;
    const tickers = await this.activesService.findTicker(ticker, category);
    return response.status(200).json(tickers);
  }
}
