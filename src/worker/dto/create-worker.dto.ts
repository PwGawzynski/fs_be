import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

export class CreateWorkerDto {
  @IsNotEmpty({
    message: 'User ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  @FindOrReject(User, {
    message: 'User with would be assigned as worker connote be found',
  })
  userID: string;

  @IsNotEmpty({
    message: 'Company ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  @FindOrReject(Company, {
    message: 'Given company cannot be found',
  })
  companyID: string;
}
