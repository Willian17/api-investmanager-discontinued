import { UpdateMarksRequestDTO } from './dtos/UpdateMarksRequestDTO';
import { Body, Controller, Get, Put, Request, Response } from '@nestjs/common';
import { MarksResponseDTO } from './dtos/ListMarksResponseDTO';
import { ListMarksUseCasePort } from 'src/application/port/input/list-marks.usecase.port';
import { UpdateMarksUseCasePort } from 'src/application/port/input/update-marks.usecase.port';

@Controller('marks')
export class MarksController {
  constructor(
    private listMarksUseCase: ListMarksUseCasePort,
    private updateMarksUseCase: UpdateMarksUseCasePort,
  ) {}

  @Get()
  async findAll(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const marks = await this.listMarksUseCase.execute(idUser);
    return response.status(200).json(marks as MarksResponseDTO[]);
  }

  @Put()
  async update(
    @Request() request,
    @Body() updateMarksRequestDTO: UpdateMarksRequestDTO[],
    @Response() response,
  ) {
    const idUser = request.user.sub;
    await this.updateMarksUseCase.execute(updateMarksRequestDTO, idUser);
    return response.status(200).json({
      message: 'Metas atualizadas com sucesso!',
    });
  }
}
