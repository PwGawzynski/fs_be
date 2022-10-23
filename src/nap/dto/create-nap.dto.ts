import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { WorkDay } from '../../work-day/entities/work-day.entity';

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
    message: 'WorkerDay Id must not be empty if it is given',
  })
  @FindOrReject(WorkDay, {
    message: 'Given WorkDay cannot be connect with any existing workDay',
  })
  workDayId?: string;
}
