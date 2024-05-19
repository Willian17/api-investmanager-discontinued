import { UpdateMarksRequestDTO } from './dtos/UpdateMarksRequestDTO';
import { Body, Controller, Get, Put, Request, Response } from '@nestjs/common';
import { MarksService } from '../../../../application/modules/marks/marks.service';
import { MarksResponseDTO } from './dtos/ListMarksResponseDTO';
import { ListMarksUseCasePort } from 'src/application/port/input/list-marks.usecase.port';

@Controller('marks')
export class MarksController {
  constructor(
    private marksService: MarksService,
    private listMarksUseCase: ListMarksUseCasePort,
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
    const marksUpdate = await this.marksService.uptade(
      updateMarksRequestDTO,
      idUser,
    );
    return response.status(200).json(marksUpdate);
  }
}
