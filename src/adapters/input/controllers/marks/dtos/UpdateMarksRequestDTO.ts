import { CategoryEnum } from '../../../../../domain/enum/CategoryEnum';

export interface UpdateMarksRequestDTO {
  id?: string;
  category: CategoryEnum;
  percentage: number;
}
