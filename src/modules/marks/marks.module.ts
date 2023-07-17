import { Module } from '@nestjs/common';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Marks } from './marks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Marks])],
  providers: [MarksService],
  controllers: [MarksController],
  exports: [MarksService],
})
export class MarksModule {}
