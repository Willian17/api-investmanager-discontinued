import { CategoryQuestionEnum } from '../question.entity';

export interface UpdateQuestionRequestDTO {
  question: string;
  criterion: string;
  category: CategoryQuestionEnum;
}
