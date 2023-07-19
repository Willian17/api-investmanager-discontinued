import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import { ActivesService } from './actives.service';
import { CreateActiveRequestDto } from './dtos/CreateActiveRequestDto';
import { UpdateActiveRequestDto } from './dtos/UpdateActiveRequestDto';

@Controller('actives')
export class ActivesController {
  constructor(private activesService: ActivesService) {}

  @Get('ticker')
  async findSearchTicker(@Request() request, @Response() response) {
    const { ticker, category } = request.query;
    const tickers = await this.activesService.findTicker(ticker, category);
    return response.status(200).json(tickers);
  }

  @Get()
  async findAll(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const tickers = await this.activesService.findAll(idUser);
    return response.status(200).json(tickers);
  }

  @Post()
  async create(
    @Request() request,
    @Body() body: CreateActiveRequestDto,
    @Response() response,
  ) {
    const idUser = request.user.sub;
    const active = await this.activesService.create(body, idUser);
    return response.status(200).json(active);
  }
  @Put(':id')
  async update(
    @Request() request,
    @Body() body: UpdateActiveRequestDto,
    @Response() response,
  ) {
    const { id } = request.params;
    const idUser = request.user.sub;
    const active = await this.activesService.update(body, id, idUser);
    return response.status(200).json(active);
  }
}
