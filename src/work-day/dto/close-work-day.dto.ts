import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { WorkDay } from '../entities/work-day.entity';

export class CloseWorkDayDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'If id is given, must not be empty',
  })
  @IsUUID()
  @FindOrReject(WorkDay, {
    message: 'Cannot find work day with given ID',
  })
  workDayId: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'End date cannot be empty if is given as param',
  })
  @IsDate({
    message: 'Start date must be JS date type',
  })
  endDate?: Date;
}