import { CategoryEnum } from '../marks.entity';

export interface UpdateMarksRequestDTO {
  id?: string;
  category: CategoryEnum;
  percentage: number;
}
