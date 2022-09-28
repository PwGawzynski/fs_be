import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from '../entities/roles.entity';
import { Account } from '../entities/account.entity';
import { hashPwd } from '../../utils/hash-pwd';
import { User } from '../entities/user.entity';
import { v4 as uuid } from 'uuid';
import { registrationMail } from '../../templates/email/registrationMail';
import { MailService } from '../../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserHelperService {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @Inject(ConfigService) private readonly ConfigService: ConfigService,
  ) {}

  // sets up new User object and tries to find unused id for it and unused activateHash
  public async setUpNewUser(createUserDto: CreateUserDto) {
    const userRoles = new Roles();
    userRoles.worker = createUserDto.roles?.worker ?? false;
    userRoles.owner = createUserDto.roles
      ? createUserDto.roles?.owner ?? false
      : true;
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
  public async sendActivateEmail(user: User) {
    await this.mailService.sendMail(
      user.account.email,
      'Thanks for registration on FarmServiceTM',
      registrationMail(
        user,
        `http://localhost:3001/users/activate/${user.account.activateHash}`,
      ),
    );
  }
}
