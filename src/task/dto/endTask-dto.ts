import { OmitType } from '@nestjs/mapped-types';
import { StartTaskDto } from './startTask-dto';
import { IsDate, IsOptional } from 'class-validator';

export class EndTaskDto extends OmitType(StartTaskDto, ['startDate'] as const) {
  @IsOptional()
  @IsDate({
    message: 'If end time is given, it cannot be empty',
  })
  endDate: Date;
}
