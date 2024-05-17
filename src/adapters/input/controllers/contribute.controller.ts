import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import { ProvideInvestmentRequestDto } from '../../../application/modules/contribute/dtos/ProvideInvestmentRequestDto';
import { ContributeService } from '../../../application/modules/contribute/contribute.service';

@Controller('contribute')
export class ContributeController {
  constructor(private contributeService: ContributeService) {}

  @Post('/calculate')
  async provideInvestment(
    @Request() request,
    @Body() body: ProvideInvestmentRequestDto,
    @Response() response,
  ) {
    const idUser = request.user.sub;
    const actives = await this.contributeService.calculateProvide(body, idUser);
    return response.status(200).json(actives);
  }
}
