import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { UserDbValidatorService } from '../db-validators/user-db-validator/user-db-validator.service';
import { UserHelperService } from './user-helper/user-helper.service';

@Module({
  imports: [forwardRef(() => MailModule), UserDbValidatorService],
  controllers: [UserController],
  providers: [UserService, UserDbValidatorService, UserHelperService],
})
export class UserModule {}
