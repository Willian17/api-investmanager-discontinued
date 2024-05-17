import { UpdateMarksRequestDTO } from './dtos/UpdateMarksRequestDTO';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import { MarksService } from '../../../../application/modules/marks/marks.service';

@Controller('marks')
export class MarksController {
  constructor(private marksService: MarksService) {}

  @Get()
  async findAll(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const marks = await this.marksService.findAll(idUser);
    return response.status(200).json(marks);
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
