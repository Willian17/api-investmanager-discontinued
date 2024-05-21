import { InjectRepository } from '@nestjs/typeorm';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';
import Mark from 'src/domain/model/mark';
import { MarkEntity } from './marks.entity';
import { Repository } from 'typeorm';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';

export class MarksAccessDataAdapter implements MarksAccessDataPort {
  constructor(
    @InjectRepository(MarkEntity)
    private marksRepository: Repository<MarkEntity>,
  ) {}
  async findAllByUser(idUser: string): Promise<Mark[]> {
    const marks: {
      id: string;
      category: CategoryEnum;
      percentage: number;
    }[] = await this.marksRepository
      .createQueryBuilder('marks')
      .select(
        'marks.id as id, marks.category as category, marks.percentage as percentage',
      )
      .where('marks.idUser = :idUser', { idUser })
      .groupBy('marks.category')
      .addGroupBy('marks.id')
      .getRawMany();

    return marks.map(({ id, category, percentage }) => {
      return {
        id,
        category,
        percentage,
        idUser,
      };
    });
  }

  async update(marks: Mark[]): Promise<void> {
    await this.marksRepository.save(marks);
  }
}
