import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum CategoryEnum {
  ACOES_NACIONAIS = 'AN',
  ACOES_INTERNACIONAIS = 'AI',
  FUNDOS_IMOBILIARIOS = 'FI',
  REITS = 'RT',
  RENDA_FIXA = 'RF',
  CRIPTO_MOEDA = 'CM',
}

@Entity({ name: 'marks' })
export class Marks {
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
