export interface UpdateActiveRequestDto {
  name: string;
  amount?: number;
  currentValue?: number;
  note?: number;
  answers?: {
    id?: string;
    idQuestion: string;
    response: boolean;
  }[];
}
