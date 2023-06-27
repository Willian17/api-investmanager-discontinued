import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './answers.entify';
import { AnswersService } from './answers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Answers])],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
