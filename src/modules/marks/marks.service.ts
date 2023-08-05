import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryEnum, Marks } from './marks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMarksRequestDTO } from './dtos/UpdateMarksRequestDTO';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Marks)
    private marksRepository: Repository<Marks>,
  ) {}

  async findAll(
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

  async uptade(marks: UpdateMarksRequestDTO[], idUser: string) {
    const percetages = marks.map((mark) => mark.percentage);
    const somaPorcetage = percetages.reduce(
      (accumulator, percetage) => accumulator + percetage,
      0,
    );
    if (somaPorcetage > 100) {
      throw new BadRequestException('Porcentagem total excedida');
    }
    const arrayMarks = marks.map((mark) => {
      if (mark.percentage > 100 || mark.percentage < 0) {
        throw new BadRequestException('Porcentagem invalida');
      }
      return {
        ...mark,
        idUser,
      };
    });
    await this.marksRepository.save(arrayMarks);

    return marks;
  }
}
