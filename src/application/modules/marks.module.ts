import { Module } from '@nestjs/common';
import { MarksService } from './marks/marks.service';
import { MarksController } from '../../adapters/input/controllers/marks/marks.controller';
import { Marks } from '../../adapters/output/marks/marks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Marks])],
  providers: [MarksService],
  controllers: [MarksController],
  exports: [MarksService],
})
export class MarksModule {}
