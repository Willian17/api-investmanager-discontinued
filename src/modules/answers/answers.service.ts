import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answers } from './answers.entify';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async create(answers: DeepPartial<Answers>[]) {
    const answersCreated = this.answersRepository.create(answers);
    await this.answersRepository.save(answersCreated);
    return answersCreated;
  }
}
