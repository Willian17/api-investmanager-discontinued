import { Marks } from './../marks/marks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../questions/question.entity';
import { Actives } from '../actives/actives.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Marks, (marks) => marks.user)
  marks: Marks[];

  @OneToMany(() => Actives, (actives) => actives.user)
  actives: Actives[];
}
