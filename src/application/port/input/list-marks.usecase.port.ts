import { MarksResponseDTO } from 'src/adapters/input/controllers/marks/dtos/ListMarksResponseDTO';

export abstract class ListMarksUseCasePort {
  abstract execute(idUser: string): Promise<MarksResponseDTO[]>;
}
