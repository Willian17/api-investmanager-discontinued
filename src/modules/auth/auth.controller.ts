import { Body, Controller, Post, Get, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { SigninRequestDto } from './dtos/SigninRequestDto';
import { SignupRequestDto } from './dtos/SignupRequestDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SigninRequestDto, @Response() response) {
    const token = await this.authService.signIn({ ...signInDto });
    return response.status(200).json(token);
  }

  @Public()
  @Post('signUp')
  async singUp(@Body() signUpDto: SignupRequestDto, @Response() response) {
    const signup = await this.authService.signUp({ ...signUpDto });
    return response.status(200).json(signup);
  }

  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
