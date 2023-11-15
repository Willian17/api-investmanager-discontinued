import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnswersModule } from '../answers/answers.module';
import { MarksModule } from '../marks/marks.module';
import { ConfigModule } from '@nestjs/config';
import { ContributeController } from './contribute.controller';
import { ContributeService } from './contribute.service';
import { ActivesModule } from '../actives/actives.module';

@Module({
  imports: [HttpModule, ActivesModule, MarksModule, ConfigModule],
  providers: [ContributeService],
  controllers: [ContributeController],
})
export class ContributeModule {}
