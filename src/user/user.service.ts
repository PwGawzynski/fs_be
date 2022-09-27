import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UniversalResponseObject } from '../../types';
import { createReadStream } from 'fs';
import * as path from 'path';
import { UserHelperService } from './user-helper/user-helper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserHelperService)
    private readonly userHelperService: UserHelperService,
    @Inject(ConfigService) private readonly ConfigService: ConfigService,
  ) {}

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
    const user = await this.userHelperService.setUpNewUser(createUserDto);
    // send registration email on given address
    console.log(user);
    this.userHelperService.sendActivateEmail(user);
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
      relations: ['roles', 'account'],
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
