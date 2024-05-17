import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(email: string, password: string, name: string): Promise<any> {
    const user = this.usersRepository.create({ email, password, name });
    return await this.usersRepository.save(user);
  }
}
