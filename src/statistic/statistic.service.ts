import { Inject, Injectable } from '@nestjs/common';
import { GetWorkerDailyDto } from './dto/get-worker-daily.dto';
import { UniversalResponseObject } from '../../types';
import { StatisticHelperService } from './statistic-helper/statistic-helper.service';
import { User } from '../user/entities/user.entity';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';
import { Worker } from '../worker/entities/worker.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class StatisticService {
  constructor(
    @Inject(StatisticHelperService)
    private readonly statisticHelperService: StatisticHelperService,
    @Inject(CompanyDbValidatorService)
    private readonly companyDbValidatorService: CompanyDbValidatorService,
  ) {}
  async workerDailyDoneTasks(data: GetWorkerDailyDto, user: User) {
    const worker = await Worker.findOne({
      where: {
        id: data.workerId,
      },
      relations: ['isWorkerAtCompany'],
    });
    const isOwner = await this.companyDbValidatorService.isOwner(
      worker.isWorkerAtCompany.id,
      user,
    );
    if (!(isOwner instanceof Company)) return isOwner;
    const stats = await this.statisticHelperService.getDailyTaskStats(data);

    return {
      status: true,
      data: stats,
    } as UniversalResponseObject;
  }
}
