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
import { QuestionsService } from './questions.service';
import { CreateQuestionRequestDTO } from './dtos/CreateQuestionRequestDTO';
import { UpdateQuestionRequestDTO } from './dtos/UpdateQuestionRequestDTO';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async findAll(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const questions = await this.questionsService.findAll(idUser);
    return response.status(200).json(questions);
  }

  @Get('category/:category')
  async findByCategory(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const { category } = request.params;
    const questions = await this.questionsService.findByCategory({
      idUser,
      category,
    });
    return response.status(200).json(questions);
  }

  @Post()
  async create(
    @Request() request,
    @Body() createQuestionDto: CreateQuestionRequestDTO,
    @Response() response,
  ) {
    const idUser = request.user.sub;
    const questionCreated = await this.questionsService.create({
      ...createQuestionDto,
      idUser,
    });
    return response.status(200).json(questionCreated);
  }

  @Put('/:id')
  async update(
    @Request() request,
    @Body() updateQuestionDto: UpdateQuestionRequestDTO,
    @Response() response,
  ) {
    const idUser = request.user.sub;
    const { id } = request.params;
    const questionUpdate = await this.questionsService.update({
      ...updateQuestionDto,
      id,
      idUser,
    });
    return response.status(200).json(questionUpdate);
  }

  @Delete('/:id')
  async delete(@Request() request, @Response() response) {
    const idUser = request.user.sub;
    const { id } = request.params;
    const question = await this.questionsService.delete({ id, idUser });
    return response.status(200).json(question);
  }
}
