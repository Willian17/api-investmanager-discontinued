import { Module } from '@nestjs/common';
import { QuestionsService } from './questions/questions.service';
import { Question } from './questions/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from '../../adapters/input/controllers/questions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
