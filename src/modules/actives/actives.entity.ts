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

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true, type: 'decimal' })
  currentValue?: number;

  @Column({ nullable: true })
  note?: number;

  @Column({ foreignKeyConstraintName: 'user_actives', select: false })
  idUser: string;

  @ManyToOne(() => User, (user) => user.actives, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToMany(() => Answers, (answers) => answers.active, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  answers: Answers[];
}
