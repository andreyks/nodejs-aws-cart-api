import { Injectable } from '@nestjs/common';
// import { randomUUID } from 'node:crypto';
// import { User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  // private readonly users: Record<string, User>;

  // constructor() {
  //   this.users = {};
  // }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // findOne(name: string): User {
  //   for (const id in this.users) {
  //     if (this.users[id].name === name) {
  //       return this.users[id];
  //     }
  //   }
  //   return;
  // }

  async createOne({ email, password }: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create({
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  // createOne({ name, password }: User): User {
  //   const id = randomUUID();
  //   const newUser = { id, name, password };

  //   this.users[id] = newUser;

  //   return newUser;
  // }
}
