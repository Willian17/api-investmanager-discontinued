import { CategoryEnum } from 'src/domain/enum/CategoryEnum';

export interface MarksResponseDTO {
  id: string;
  category: CategoryEnum;
  percentage: number;
}
