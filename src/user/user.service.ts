import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hashPwd } from '../utils/hash-pwd';
import { UniversalResponseObject } from '../../types';
import { MailService } from '../mail/mail.service';
import { registrationMail } from '../templates/email/registrationMail';
import { createReadStream } from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @Inject(ConfigService) private readonly ConfigService: ConfigService,
  ) {}

  // sets up new User object and tries to find unused id for it and unused activateHash
  private static async _setUpNewUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.login = createUserDto.login;
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.pwdHashed = hashPwd(createUserDto.password);
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    do {
      user.id = uuid();
      user.activateHash = uuid();
    } while (
      await User.findOne({
        where: [{ id: user.id }, { activateHash: user.activateHash }],
      })
    );
    return user;
  }

  // sends email with activation link to user
  private async _sendActivateEmail(user: User) {
    await this.mailService.sendMail(
      user.email,
      'Thanks for registration on FarmServiceTM',
      registrationMail(
        user,
        `http://localhost:3001/users/activate/${user.activateHash}`,
      ),
    );
  }

  // it's create new user entity and manage it's proper saving in DB and sending registration email.
  async create(createUserDto: CreateUserDto): Promise<UniversalResponseObject> {
    // first check if user has;n been registered before
    if (
      await User.findOne({
        where: [
          {
            email: createUserDto.email,
          },
          { login: createUserDto.login },
        ],
      })
    )
      // if user has been registered before send reject info
      return {
        status: false,
        message: 'User with given email or login already exist',
      } as UniversalResponseObject;
    // if not sign data from req to user entity
    const user = await UserService._setUpNewUser(createUserDto);
    // send registration email on given address
    this._sendActivateEmail(user);
    // save user entity
    user.save();
    // if everything has been done correct send confirmation info
    return {
      status: true,
      message:
        'Email with link to activate your account has been send, go to your mail box and click on it.',
    } as UniversalResponseObject;
  }

  // this service check if given activation Hash is is stored in Db for any user
  // and base on this update it activate account status
  async activate(activateHash: string) {
    const user = await User.findOne({
      where: {
        activateHash,
      },
    });
    if (!user)
      return {
        status: false,
      } as UniversalResponseObject;
    user.activated = true;
    // TODO reformat !!
    (
      await User.update(
        {
          id: user.id,
        },
        user,
      )
    ).affected;
  }

  getUserPhoto(user: User) {
    const file = createReadStream(
      path.join(
        process.cwd(),
        '/',
        this.ConfigService.get<string>('filesPaths.userProfilePhotos'),
        '/',
        user.id,
        '/',
        user.profilePhotoPath + '.jpg',
      ),
    );
    return new StreamableFile(file);
  }
}
