import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException('Email ou senha inválidos');
    }
    const isMatchPassword = await bcrypt.compare(pass, user.password);   
    if (!isMatchPassword) {
      throw new BadRequestException('Email ou senha inválidos');
    }
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string, name: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new BadRequestException('Email já cadastrado');
    }
    const passwordCripto = await bcrypt.hash(pass, 10);
    const userCreate = await this.usersService.create(email, passwordCripto, name);
    return userCreate;
  }
}