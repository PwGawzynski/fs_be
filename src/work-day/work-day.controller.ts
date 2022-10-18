import { Controller } from '@nestjs/common';
import { WorkDayService } from './work-day.service';

@Controller('work-day')
export class WorkDayController {
  constructor(private readonly workDayService: WorkDayService) {}
}
