import { Module } from '@nestjs/common';
import { WorkDayService } from './work-day.service';
import { WorkDayController } from './work-day.controller';

@Module({
  controllers: [WorkDayController],
  providers: [WorkDayService],
})
export class WorkDayModule {}
