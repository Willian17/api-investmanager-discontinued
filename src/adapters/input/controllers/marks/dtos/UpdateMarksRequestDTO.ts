import { CategoryEnum } from '../../../../output/marks/marks.entity';

export interface UpdateMarksRequestDTO {
  id?: string;
  category: CategoryEnum;
  percentage: number;
}
