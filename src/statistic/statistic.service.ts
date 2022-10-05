import { Inject, Injectable } from '@nestjs/common';
import { GetWorkerDailyDto } from './dto/get-worker-daily.dto';
import { UniversalResponseObject } from '../../types';
import {
  Operation,
  StatisticHelperService,
} from './statistic-helper/statistic-helper.service';
import { User } from '../user/entities/user.entity';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';
import { Company } from '../company/entities/company.entity';
import { WorkerDbValidatorService } from '../db-validators/worker-db-validator/worker-db-validator.service';

@Injectable()
export class StatisticService {
  constructor(
    @Inject(StatisticHelperService)
    private readonly statisticHelperService: StatisticHelperService,
    @Inject(CompanyDbValidatorService)
    private readonly companyDbValidatorService: CompanyDbValidatorService,
    @Inject(WorkerDbValidatorService)
    private readonly workerDbValidatorService: WorkerDbValidatorService,
  ) {}
  async workerDailyDoneTasks(data: GetWorkerDailyDto, user: User) {
    const worker = await this.workerDbValidatorService.getWorkerWithCompany(
      data.workerId,
    );
    const isOwner = await this.companyDbValidatorService.isOwner(
      worker.isWorkerAtCompany.id,
      user,
    );
    if (!(isOwner instanceof Company)) return isOwner;
    const stats = await this.statisticHelperService.getDailyTaskStats(
      data,
      Operation.Daily,
    );

    return {
      status: true,
      data: stats,
    } as UniversalResponseObject;
  }

  async workerAllDoneTaskStats(data: GetWorkerDailyDto, user: User) {
    const worker = await this.workerDbValidatorService.getWorkerWithCompany(
      data.workerId,
    );
    const isOwner = await this.companyDbValidatorService.isOwner(
      worker.isWorkerAtCompany.id,
      user,
    );
    if (!(isOwner instanceof Company)) return isOwner;
    const stats = await this.statisticHelperService.getDailyTaskStats(
      data,
      Operation.All,
    );

    return {
      status: true,
      data: stats,
    } as UniversalResponseObject;
  }
}
