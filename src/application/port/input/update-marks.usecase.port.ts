import { UpdateMarksRequestDTO } from 'src/adapters/input/controllers/marks/dtos/UpdateMarksRequestDTO';

export abstract class UpdateMarksUseCasePort {
  abstract execute(
    marks: UpdateMarksRequestDTO[],
    idUser: string,
  ): Promise<void>;
}
