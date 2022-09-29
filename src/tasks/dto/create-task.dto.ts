import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import { DoExistForCompany } from '../../db-validators/db-validation-decorators/company/DoExistForCompany';
import { DoExistForUser } from '../../db-validators/db-validation-decorators/user/DoExistForUser';

export class CreateTaskDto {
  @IsString({ message: 'Task name nus be a string type' })
  @MaxLength(300)
  @IsNotEmpty({ message: 'Task name cannot be empty' })
  name: string;

  @IsString({
    message: 'Task description must be a string type',
  })
  @MaxLength(1000)
  @IsOptional()
  description: string;

  // Purchaser with will be signed to task is identified by he's id number,
  // is optional because it be signed to user who causer creation
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({
    message: 'If userID is given, it cannot be empty',
  })
  @Length(36, 36, {
    message: 'Id must have 36 characters',
  })
  @DoExistForUser()
  purchaserID: string;

  // Company with will be signed to task is identified by he's id number
  @IsNotEmpty({
    message: 'Company must be chosen for any task',
  })
  @Length(36, 36)
  @DoExistForCompany()
  companyID: string;

  @IsOptional()
  @IsDate({
    message: 'If Performance date is given, it cannot be empty',
  })
  performanceDay: Date;
}
