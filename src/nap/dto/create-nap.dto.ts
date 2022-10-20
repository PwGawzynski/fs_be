import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Worker } from '../../worker/entities/worker.entity';

export class CreateNapDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'Start date must not be empty if it is given',
  })
  @IsDate({
    message: 'Start date param must be date type',
  })
  startDate?: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'End date must not be empty if it is given',
  })
  @IsDate({
    message: 'End date param must be date type',
  })
  endDate?: Date;

  @IsOptional()
  @IsNotEmpty({
    message: 'Worker Id must not be empty if it is given',
  })
  @FindOrReject(Worker)
  workDayId?: string;
}
