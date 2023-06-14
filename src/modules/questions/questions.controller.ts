import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Res,
  Response,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionRequestDTO } from './dtos/CreateQuestionRequestDTO';
import { UpdateQuestionRequestDTO } from './dtos/UpdateQuestionRequestDTO';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async findAll(@Request() req) {
    const idUser = req.user.sub;
    return await this.questionsService.findAll(idUser);
  }

  @Get('category/:category')
  async findByCategory(@Request() req) {
    const idUser = req.user.sub;
    const { category } = req.params;
    return await this.questionsService.findByCategory({ idUser, category });
  }

  @Post()
  async create(
    @Request() req,
    @Body() createQuestionDto: CreateQuestionRequestDTO,
  ) {
    const idUser = req.user.sub;
    return await this.questionsService.create({
      ...createQuestionDto,
      idUser,
    });
  }

  @Put('/:id')
  async update(
    @Request() req,
    @Body() updateQuestionDto: UpdateQuestionRequestDTO,
    @Response() res,
  ) {
    const idUser = req.user.sub;
    const { id } = req.params;
    await this.questionsService.update({
      ...updateQuestionDto,
      id,
      idUser,
    });
    res.status(204).send();
  }

  @Delete('/:id')
  async delete(@Request() req, @Response() res) {
    const idUser = req.user.sub;
    const { id } = req.params;
    await this.questionsService.delete({ id, idUser });
    return res.status(204).send();
  }
}
