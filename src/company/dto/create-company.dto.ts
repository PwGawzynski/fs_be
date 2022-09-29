import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsUniqForCompany } from '../../db-validators/db-validation-decorators/company/IsUniqForCompany';
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company name cannot be empty field' })
  @MaxLength(500)
  @IsUniqForCompany()
  name: string;

  @IsOptional()
  @MaxLength(2000)
  description: string;
}
