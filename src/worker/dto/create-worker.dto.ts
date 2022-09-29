import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { DoExistForCompany } from '../../db-validators/db-validation-decorators/company/DoExistForCompany';
import { DoExistForUser } from '../../db-validators/db-validation-decorators/user/DoExistForUser';

export class CreateWorkerDto {
  @IsNotEmpty({
    message: 'User ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  @DoExistForUser()
  userID: string;

  @IsNotEmpty({
    message: 'Company ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  @DoExistForCompany()
  companyID: string;
}
