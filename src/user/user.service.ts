import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hashPwd } from '../utils/hash-pwd';
import { UniversalResponseObject } from '../../types';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(@Inject(MailService) private mailService: MailService) {}

  async create(createUserDto: CreateUserDto): Promise<UniversalResponseObject> {
    // TODO check before save if given user do not exist in db already
    if (
      await User.findOne({
        where: {
          email: createUserDto.email,
        },
      })
    )
      return {
        status: false,
        message: 'User with given email already exist',
      } as UniversalResponseObject;
    const user = new User();
    user.login = createUserDto.login;
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.id = uuid();
    user.pwdHashed = hashPwd(createUserDto.password);
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    /*await this.mailService.sendMail(
      user.email,
      'thanks for registration on FarmServiceTM',
      'click on link below to activate your account',
    );*/
    user.save();
    return {
      status: true,
      message:
        'Email with link to activate your account has been send, go to your mail box and click on it.',
    } as UniversalResponseObject;
  }
}
