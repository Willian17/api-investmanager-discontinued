import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marks } from 'src/adapters/output/marks/marks.entity';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';
import { Repository } from 'typeorm';

@Injectable()
export class ListMarksUseCase {
  constructor(
    @InjectRepository(Marks)
    private marksRepository: Repository<Marks>,
  ) {}
  async execute(
    idUser: string,
  ): Promise<{ category: CategoryEnum; percentage: number }[]> {
    const marks = await this.marksRepository
      .createQueryBuilder('marks')
      .where('marks.idUser = :idUser', { idUser })
      .groupBy('marks.category')
      .addGroupBy('marks.id')
      .getRawMany();

    const marksCategory = Object.values(CategoryEnum).map((category) => {
      return {
        category,
        percentage:
          +marks.find((mark) => mark.marks_category === category)
            ?.marks_percentage || 0,
        id:
          marks.find((mark) => mark.marks_category === category)?.marks_id ||
          undefined,
      };
    });

    return marksCategory;
  }
}
