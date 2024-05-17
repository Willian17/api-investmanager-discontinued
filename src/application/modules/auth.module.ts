import { Module } from '@nestjs/common';
import { AuthController } from '../../adapters/input/controllers/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
