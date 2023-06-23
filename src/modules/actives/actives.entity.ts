import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { CategoryEnum } from '../marks/marks.entity';
import { Answers } from '../answers/answers.entify';

@Entity({ name: 'actives' })
export class Actives {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CategoryEnum })
  category: CategoryEnum;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  currentValue?: number;

  @Column()
  note?: number;

  @Column({ foreignKeyConstraintName: 'user_actives', select: false })
  idUser: string;

  @ManyToOne(() => User, (user) => user.actives)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToMany(() => Answers, (answers) => answers.active)
  answers: Answers[];
}
