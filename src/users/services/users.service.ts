import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...createUserDto,
    });
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public async findOne(where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.usersRepository.findOneBy(where);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...updateUserDto,
      id,
    });
  }

  public async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
