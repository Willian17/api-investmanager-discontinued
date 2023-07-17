import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actives } from './actives.entity';
import { ActivesService } from './actives.service';
import { HttpModule } from '@nestjs/axios';
import { ActivesController } from './actives.controller';
import { MarketService } from './market.service';
import { AnswersModule } from '../answers/answers.module';
import { MarksModule } from '../marks/marks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actives]),
    HttpModule,
    AnswersModule,
    MarksModule,
  ],
  providers: [ActivesService, MarketService],
  controllers: [ActivesController],
})
export class ActivesModule {}
