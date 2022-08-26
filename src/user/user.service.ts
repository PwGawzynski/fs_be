import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user = new User();
    user.login = createUserDto.login;
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.id = uuid();
    user.pwdHashed = hashPwd(createUserDto.password);
    user.age = createUserDto.age;
    user.save();
    return createUserDto;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
