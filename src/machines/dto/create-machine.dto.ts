import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsUniqForMachine } from '../../db-validators/db-validation-decorators/machine/IsUnikForMachine';

export class CreateMachineDto {
  @IsString({
    message: 'Name of machine must be a string type',
  })
  @IsNotEmpty({
    message: 'Name of machine cannot be empty',
  })
  @MaxLength(300, {
    message: 'Name of machine cannot be longer than 300 characters',
  })
  name: string;

  @IsString({
    message: 'Brand must be a string type',
  })
  @IsNotEmpty({
    message: 'Machine brand cannot be empty',
  })
  @MaxLength(200, {
    message: 'Machine brand cannot be longer than 200 characters',
  })
  brand: string;

  @IsString({
    message: 'Machine model must be a string type',
  })
  @IsNotEmpty({
    message: 'Machine model cannot be empty',
  })
  @MaxLength(300, {
    message: 'Machine model cannot be longer than 300 characters',
  })
  model: string;

  @IsOptional()
  @Max(99999)
  @Min(0)
  workedHours: number;

  @IsString({
    message: 'Machine Registration number must be a string type',
  })
  @IsNotEmpty({
    message: 'Machine Registration number cannot be empty',
  })
  @MaxLength(50, {
    message: 'Machine Registration number cannot be longer than 50 characters',
  })
  @IsUniqForMachine()
  registrationNumber: string;

  @IsNotEmpty({
    message: 'Company with should be signed to machine cannot be empty',
  })
  @Length(36, 36, {
    message: 'Company id must be 36 characters string',
  })
  @IsUUID()
  companyID: string;
}
