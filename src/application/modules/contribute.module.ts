import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarksModule } from './marks.module';
import { ConfigModule } from '@nestjs/config';
import { ContributeController } from '../../adapters/input/controllers/contribute.controller';
import { ContributeService } from './contribute/contribute.service';
import { ActivesModule } from './actives.module';

@Module({
  imports: [HttpModule, ActivesModule, MarksModule, ConfigModule],
  providers: [ContributeService],
  controllers: [ContributeController],
})
export class ContributeModule {}
