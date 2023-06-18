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

    const marksCategory = [
      {
        id:
          marks.find(
            (mark) => mark.marks_category === CategoryEnum.ACOES_NACIONAIS,
          )?.marks_id || null,
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage:
          +marks.find(
            (mark) => mark.marks_category === CategoryEnum.ACOES_NACIONAIS,
          )?.marks_percentage || 0,
      },
      {
        id:
          marks.find(
            (mark) => mark.marks_category === CategoryEnum.ACOES_INTERNACIONAIS,
          )?.marks_id || null,
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage:
          +marks.find(
            (mark) => mark.marks_category === CategoryEnum.ACOES_INTERNACIONAIS,
          )?.marks_percentage || 0,
      },
      {
        id:
          marks.find(
            (mark) => mark.marks_category === CategoryEnum.FUNDOS_IMOBILIARIOS,
          )?.marks_id || null,
        category: CategoryEnum.FUNDOS_IMOBILIARIOS,
        percentage:
          +marks.find(
            (mark) => mark.marks_category === CategoryEnum.FUNDOS_IMOBILIARIOS,
          )?.marks_percentage || 0,
      },
      {
        id:
          marks.find((mark) => mark.marks_category === CategoryEnum.REITS)
            ?.marks_id || null,
        category: CategoryEnum.REITS,
        percentage:
          +marks.find((mark) => mark.marks_category === CategoryEnum.REITS)
            ?.marks_percentage || 0,
      },
      {
        id:
          marks.find((mark) => mark.marks_category === CategoryEnum.RENDA_FIXA)
            ?.marks_id || null,
        category: CategoryEnum.RENDA_FIXA,
        percentage:
          +marks.find((mark) => mark.marks_category === CategoryEnum.RENDA_FIXA)
            ?.marks_percentage || 0,
      },
      {
        id:
          marks.find(
            (mark) => mark.marks_category === CategoryEnum.CRIPTO_MOEDA,
          )?.marks_id || null,
        category: CategoryEnum.CRIPTO_MOEDA,
        percentage:
          +marks.find(
            (mark) => mark.marks_category === CategoryEnum.CRIPTO_MOEDA,
          )?.marks_percentage || 0,
      },
    ];

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
