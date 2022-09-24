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
import { Account } from './entities/account.entity';
import { Roles } from './entities/roles.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @Inject(ConfigService) private readonly ConfigService: ConfigService,
  ) {}

  // sets up new User object and tries to find unused id for it and unused activateHash
  private static async _setUpNewUser(createUserDto: CreateUserDto) {
    const userRoles = new Roles();
    userRoles.worker = createUserDto.roles.worker;
    userRoles.owner = createUserDto.roles.owner;
    const userAccount = new Account();
    userAccount.login = createUserDto.login;
    userAccount.pwdHashed = hashPwd(createUserDto.password);
    userAccount.email = createUserDto.email;
    const user = new User();
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.age = createUserDto.age;
    user.account = userAccount;
    user.roles = userRoles;
    do {
      user.id = uuid();
      user.account.activateHash = uuid();
    } while (
      await User.findOne({
        where: [
          { id: user.id },
          {
            account: {
              activateHash: user.account.activateHash,
            },
          },
        ],
        relations: ['account'],
      })
    );
    await userRoles.save();
    await userAccount.save();
    return user;
  }

  // sends email with activation link to user
  private async _sendActivateEmail(user: User) {
    await this.mailService.sendMail(
      user.account.email,
      'Thanks for registration on FarmServiceTM',
      registrationMail(
        user,
        `http://localhost:3001/users/activate/${user.account.activateHash}`,
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
            account: {
              email: createUserDto.email,
            },
          },
          {
            account: {
              login: createUserDto.login,
            },
          },
        ],
        relations: ['account'],
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
    console.log(user);
    this._sendActivateEmail(user);
    // save user entity
    // if everything has been done correct send confirmation info
    return user
      .save()
      .then(() => {
        return {
          status: true,
          message:
            'Email with link to activate your account has been send, go to your mail box and click on it.',
        } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }

  // this service check if given activation Hash is is stored in Db for any user
  // and base on this update it activate account status
  async activate(activateHash: string) {
    const user = await User.findOne({
      where: {
        account: {
          activateHash,
        },
      },
    });
    if (!user)
      return {
        status: false,
      } as UniversalResponseObject;
    user.account.activated = true;
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
    // Returns userProfile photo from file system
    // Path si constructed based on user id and userProfilePath
    // because it is obligated for creating ETag header.
    const file = createReadStream(
      path.join(
        process.cwd(),
        '/',
        this.ConfigService.get<string>('filesPaths.userProfilePhotos'),
        '/',
        user.id,
        '/',
        user.account.profilePhotoPath + '.jpg',
      ),
    );
    return new StreamableFile(file);
  }
}
