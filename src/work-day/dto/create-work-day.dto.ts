import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Worker } from '../../worker/entities/worker.entity';

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
  companyId?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'Worker (id) cannot be empty if is given as param',
  })
  @FindOrReject(Worker, {
    message: 'Cannot find company with given ID',
  })
  workerId?: string;
}
