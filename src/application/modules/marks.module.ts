import { Module } from '@nestjs/common';
import { MarksService } from './marks/marks.service';
import { MarksController } from '../../adapters/input/controllers/marks/marks.controller';
import { MarkEntity } from '../../adapters/output/marks/marks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListMarksUseCasePort } from '../port/input/list-marks.usecase.port';
import { ListMarksUseCase } from '../usecase/marks/list-marks.usecase';
import { MarksAccessDataAdapter } from 'src/adapters/output/marks/marks-access-data.adapter';
import { MarksAccessDataPort } from '../port/output/marks-access-data.port';

@Module({
  imports: [TypeOrmModule.forFeature([MarkEntity])],
  providers: [
    MarksService,
    {
      provide: ListMarksUseCasePort,
      useClass: ListMarksUseCase,
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
