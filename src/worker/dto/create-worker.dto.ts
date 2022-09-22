import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty({
    message: 'User ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  userID: string;

  @IsNotEmpty({
    message: 'Company ID cannot be empty string',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'ID must have 36 characters',
  })
  companyID: string;
}
