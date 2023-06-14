import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('signUp')
  async singUp(@Body() signUpDto: Record<string, any>) {
    return await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
