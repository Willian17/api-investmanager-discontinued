import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: 'john',
      email: 'john@email.com',
      password: 'changeme',
    },
    {
      id: 2,
      name: 'maria',
      email: 'maria@email.com',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
