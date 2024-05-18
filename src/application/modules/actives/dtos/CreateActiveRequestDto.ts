import { CategoryEnum } from '../../../../domain/enum/CategoryEnum';

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
