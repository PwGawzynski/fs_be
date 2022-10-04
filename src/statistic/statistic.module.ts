import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { StatisticHelperService } from './statistic-helper/statistic-helper.service';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';

@Module({
  controllers: [StatisticController],
  providers: [
    StatisticService,
    StatisticHelperService,
    CompanyDbValidatorService,
  ],
})
export class StatisticModule {}
