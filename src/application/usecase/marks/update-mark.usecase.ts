import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateMarksRequestDTO } from 'src/adapters/input/controllers/marks/dtos/UpdateMarksRequestDTO';
import { UpdateMarksUseCasePort } from 'src/application/port/input/update-marks.usecase.port';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';
import Mark from 'src/domain/model/mark';

@Injectable()
export class UpdateMarkUseCase extends UpdateMarksUseCasePort {
  constructor(private marksAccessDataPort: MarksAccessDataPort) {
    super();
  }

  async execute(marks: UpdateMarksRequestDTO[], idUser: string) {
    const porcentages = marks.map((mark) => mark.percentage);
    const somaPorcetage = porcentages.reduce(
      (accumulator, percetage) => accumulator + percetage,
      0,
    );
    if (somaPorcetage > 100) {
      throw new BadRequestException(
        'Porcentagem total excedida',
        HttpStatus.BAD_REQUEST,
      );
    }

    const arrayMarks: Mark[] = marks.map((mark) => {
      if (mark.percentage < 0) {
        throw new BadRequestException(
          'Porcentagem invalida',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        ...mark,
        idUser,
      };
    });
    this.marksAccessDataPort.update(arrayMarks);
    return Promise.resolve();
  }
}
