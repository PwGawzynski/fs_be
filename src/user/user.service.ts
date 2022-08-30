import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    // TODO check before save if given user do not exist in db already
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
}