import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company name cannot be empty field' })
  @MaxLength(500)
  name: string;

  @IsOptional()
  @MaxLength(2000)
  description: string;
}
