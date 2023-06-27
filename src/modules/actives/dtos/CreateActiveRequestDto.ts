import { CategoryEnum } from 'src/modules/marks/marks.entity';

export interface CreateActiveRequestDto {
  category: CategoryEnum;
  name: string;
  amount?: number;
  currentValue?: number;
  note?: number;
  answers?: {
    idQuestion: string;
    response: boolean;
  }[];
}
