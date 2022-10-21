import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Worker } from '../../worker/entities/worker.entity';

export class GetWorkDayDto {
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
    message: 'Worker (id) cannot be empty if is given as param',
  })
  @FindOrReject(Worker, {
    message: 'Cannot find Worker with given ID',
  })
  workerId?: string;
}
