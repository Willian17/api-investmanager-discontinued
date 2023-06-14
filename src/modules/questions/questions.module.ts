import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
