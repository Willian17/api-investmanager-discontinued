import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryQuestionEnum, Question } from './question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async findAll(
    idUser: string,
  ): Promise<{ category: CategoryQuestionEnum; quantity: number }[]> {
    const questions = await this.questionsRepository
      .createQueryBuilder('questions')
      .select('questions.category')
      .addSelect('COUNT(questions.id)', 'quantity')
      .where('questions.idUser = :idUser', { idUser })
      .groupBy('questions.category')
      .getRawMany();

    console.log(questions);
    const questionsCategory = [
      {
        category: CategoryQuestionEnum.ACOES_NACIONAIS,
        quantity:
          +questions.find(
            (question) =>
              question.questions_category ===
              CategoryQuestionEnum.ACOES_NACIONAIS,
          )?.quantity || 0,
      },
      {
        category: CategoryQuestionEnum.ACOES_INTERNACIONAIS,
        quantity:
          +questions.find(
            (question) =>
              question.questions_category ===
              CategoryQuestionEnum.ACOES_INTERNACIONAIS,
          )?.quantity || 0,
      },
      {
        category: CategoryQuestionEnum.FUNDOS_IMOBILIARIOS,
        quantity:
          +questions.find(
            (question) =>
              question.questions_category ===
              CategoryQuestionEnum.FUNDOS_IMOBILIARIOS,
          )?.quantity || 0,
      },
      {
        category: CategoryQuestionEnum.REITS,
        quantity:
          +questions.find(
            (question) =>
              question.questions_category === CategoryQuestionEnum.REITS,
          )?.quantity || 0,
      },
    ];
    return questionsCategory;
  }

  async findByCategory({ idUser, category }) {
    return await this.questionsRepository.find({
      where: { idUser, category },
    });
  }

  async create({ question, criterion, category, idUser }) {
    const questionCreated = this.questionsRepository.create({
      question,
      criterion,
      category,
      idUser,
    });
    return await this.questionsRepository.save(questionCreated);
  }
  async update({ id, question, criterion, idUser }) {
    const questionFind = await this.questionsRepository.findOneBy({
      id,
      idUser,
    });
    if (!questionFind) {
      throw new NotFoundException('Critério não encontrado');
    }
    questionFind.question = question;
    questionFind.criterion = criterion;
    await this.questionsRepository.update(id, questionFind);
    return questionFind;
  }

  async delete({ id, idUser }) {
    const questionFind = await this.questionsRepository.findOneBy({
      id,
      idUser,
    });
    if (!questionFind) {
      throw new NotFoundException('Critério não encontrado');
    }
    await this.questionsRepository.delete(id);
    return questionFind;
  }
}
