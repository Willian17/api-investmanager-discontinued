import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actives } from './actives/actives.entity';
import { ActivesService } from './actives/actives.service';
import { HttpModule } from '@nestjs/axios';
import { ActivesController } from '../../adapters/input/controllers/actives.controller';
import { MarketService } from './actives/market.service';
import { AnswersModule } from './answers.module';
import { MarksModule } from './marks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actives]),
    HttpModule,
    AnswersModule,
    MarksModule,
    ConfigModule,
  ],
  providers: [ActivesService, MarketService],
  controllers: [ActivesController],
  exports: [ActivesService, MarketService],
})
export class ActivesModule {}
