import { Module } from '@nestjs/common';
import { MarksController } from '../../adapters/input/controllers/marks/marks.controller';
import { MarkEntity } from '../../adapters/output/marks/marks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListMarksUseCasePort } from '../port/input/list-marks.usecase.port';
import { ListMarksUseCase } from '../usecase/marks/list-marks.usecase';
import { MarksAccessDataAdapter } from 'src/adapters/output/marks/marks-access-data.adapter';
import { MarksAccessDataPort } from '../port/output/marks-access-data.port';
import { UpdateMarksUseCase } from '../usecase/marks/update-mark.usecase';
import { UpdateMarksUseCasePort } from '../port/input/update-marks.usecase.port';

@Module({
  imports: [TypeOrmModule.forFeature([MarkEntity])],
  providers: [
    {
      provide: ListMarksUseCasePort,
      useClass: ListMarksUseCase,
    },
    {
      provide: UpdateMarksUseCasePort,
      useClass: UpdateMarksUseCase,
    },
    {
      provide: MarksAccessDataPort,
      useClass: MarksAccessDataAdapter,
    },
  ],
  controllers: [MarksController],
  exports: [
    {
      provide: ListMarksUseCasePort,
      useClass: ListMarksUseCase,
    },
  ],
})
export class MarksModule {}
