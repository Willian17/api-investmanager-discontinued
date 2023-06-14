import { CategoryQuestionEnum } from '../question.entity';

export interface CreateQuestionRequestDTO {
  question: string;
  criterion: string;
  category: CategoryQuestionEnum;
}
