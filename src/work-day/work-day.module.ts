import { Module } from '@nestjs/common';
import { WorkDayService } from './work-day.service';
import { WorkDayController } from './work-day.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [WorkDayController],
  providers: [WorkDayService, CompanyService],
  imports: [CompanyService],
})
export class WorkDayModule {}
