import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../questions/question.entity';

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
}
