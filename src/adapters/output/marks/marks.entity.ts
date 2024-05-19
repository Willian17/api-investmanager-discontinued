import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../application/modules/users/user.entity';
import { CategoryEnum } from '../../../domain/enum/CategoryEnum';

@Entity({ name: 'marks' })
export class MarkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CategoryEnum })
  category: CategoryEnum;

  @Column()
  percentage: number;

  @Column({ foreignKeyConstraintName: 'user_marks', select: false })
  idUser: string;

  @ManyToOne(() => User, (user) => user.marks)
  @JoinColumn({ name: 'idUser' })
  user: User;
}
