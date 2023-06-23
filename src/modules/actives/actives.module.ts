import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actives } from './actives.entity';
import { ActivesService } from './actives.service';
import { HttpModule } from '@nestjs/axios';
import { ActivesController } from './actives.controller';
import { MarketService } from './market.service';

@Module({
  imports: [TypeOrmModule.forFeature([Actives]), HttpModule],
  providers: [ActivesService, MarketService],
  controllers: [ActivesController],
})
export class ActivesModule {}
