import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './answers.entify';

@Module({
  imports: [TypeOrmModule.forFeature([Answers])],
})
export class AnswersModule {}
