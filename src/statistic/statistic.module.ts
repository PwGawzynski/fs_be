import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, CompanyService],
  imports: [CompanyService],
})
export class StatisticModule {}
