import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Actives } from '../actives/actives.entity';
import { Question } from '../questions/question.entity';

@Entity({ name: 'answers' })
export class Answers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  response: boolean;

  @Column({ foreignKeyConstraintName: 'active_answers' })
  idActive: string;

  @Column({ foreignKeyConstraintName: 'question_answers' })
  idQuestion: string;

  @ManyToOne(() => Actives, (active) => active.answers)
  @JoinColumn({ name: 'idActive' })
  active: Actives;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'idQuestion' })
  question: Question;
}
