import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { QuestionsModule } from './modules/questions/questions.module';
import { MarksModule } from './modules/marks/marks.module';
import { ActivesModule } from './modules/actives/actives.module';
import { AnswersModule } from './modules/answers/answers.module';
import { ContributeModule } from './modules/contribute/contribute.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        CacheModule.registerAsync({
          imports: [ConfigModule],
          isGlobal: true,
          useFactory: async (configService: ConfigService) => {
            return {
              store: redisStore,
              ttl: configService.get('redis.ttl'),
              host: configService.get('redis.host'),
              port: configService.get('redis.port'),
            };
          },
          inject: [ConfigService],
        }),
      ],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          synchronize: true,
          entities: [],
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    JwtModule,
    QuestionsModule,
    MarksModule,
    ActivesModule,
    AnswersModule,
    ContributeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
