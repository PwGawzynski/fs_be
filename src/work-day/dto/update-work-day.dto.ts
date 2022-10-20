import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDayDto } from './create-work-day.dto';

export class UpdateWorkDayDto extends PartialType(CreateWorkDayDto) {}
