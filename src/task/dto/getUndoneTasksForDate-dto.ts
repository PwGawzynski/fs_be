import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Company } from '../../company/entities/company.entity';
import { Worker } from '../../worker/entities/worker.entity';

export class GetUndoneTasksForDateDto {
  @IsOptional()
  @IsDate({
    message: 'If Performance date is given, it cannot be empty',
  })
  performanceDay: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'Company must be chosen for any task',
  })
  @Length(36, 36)
  @FindOrReject(Company, {
    message: 'Cannot find given company',
  })
  companyID?: string;

  @IsOptional()
  @IsUUID()
  @FindOrReject(Worker, {
    message: 'One of given worker id cannot be found',
  })
  workerID?: string;
}
