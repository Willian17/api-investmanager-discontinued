import { Injectable } from '@nestjs/common';
import { MarksResponseDTO } from 'src/adapters/input/controllers/marks/dtos/ListMarksResponseDTO';
import { ListMarksUseCasePort } from 'src/application/port/input/list-marks.usecase.port';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';

@Injectable()
export class ListMarksUseCase extends ListMarksUseCasePort {
  constructor(private marksAccessDataPort: MarksAccessDataPort) {
    super();
  }
  async execute(idUser: string): Promise<MarksResponseDTO[]> {
    const marks = await this.marksAccessDataPort.findAllByUser(idUser);

    const getCategory = (category: CategoryEnum) =>
      marks.find((mark) => mark.category === category);

    const marksCategory = Object.values(CategoryEnum).map((category) => {
      return {
        category,
        percentage: +getCategory(category)?.percentage || 0,
        id: getCategory(category)?.id,
      };
    });

    return marksCategory;
  }
}
