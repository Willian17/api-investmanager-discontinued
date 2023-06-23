import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Answers } from '../answers/answers.entify';

export enum CategoryQuestionEnum {
  ACOES_NACIONAIS = 'AN',
  ACOES_INTERNACIONAIS = 'AI',
  FUNDOS_IMOBILIARIOS = 'FI',
  REITS = 'RT',
}

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  criterion: string;

  @Column({ type: 'enum', enum: CategoryQuestionEnum })
  category: CategoryQuestionEnum;

  @Column({ foreignKeyConstraintName: 'user_questions', select: false })
  idUser: string;

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToMany(() => Answers, (answers) => answers.question)
  answers: Answers[];
}
