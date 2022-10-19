import { IsDate, IsNotEmpty, IsOctal, IsOptional } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';

export class CreateWorkDayDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'Start date cannot be empty if is given as param',
  })
  @IsDate({
    message: 'Start date must be JS date type',
  })
  startDate?: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'End date cannot be empty if is given as param',
  })
  @IsDate({
    message: 'Start date must be JS date type',
  })
  endDate?: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'End date cannot be empty if is given as param',
  })
  @FindOrReject(Company, {
    message: 'Cannot find company with given ID',
  })
  doneForCompany?: Company;
}
