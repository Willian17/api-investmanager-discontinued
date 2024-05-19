import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marks } from 'src/adapters/output/marks/marks.entity';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';
import { Repository } from 'typeorm';

@Injectable()
export class ListMarksUseCase {
  constructor(private marksAccessDataPort: MarksAccessDataPort) {}
  async execute(
    idUser: string,
  ): Promise<{ category: CategoryEnum; percentage: number }[]> {
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
