import { Inject, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { User } from '../../user/entities/user.entity';
import { Worker } from '../entities/worker.entity';
import { UniversalResponseObject } from '../../../types';
import { Company } from '../../company/entities/company.entity';
import { WorkerDbValidatorService } from '../../db-validators/worker-db-validator/worker-db-validator.service';
import { CompanyDbValidatorService } from '../../db-validators/company-db-validator/company-db-validator.service';

@Injectable()
export class WorkerHelperService {
  constructor(
    @Inject(WorkerDbValidatorService)
    private readonly workerDbValidatorService: WorkerDbValidatorService,
    @Inject(CompanyDbValidatorService)
    private readonly companyDbValidatorService: CompanyDbValidatorService,
  ) {}

  public async assignDataToWorker(
    data: CreateWorkerDto,
    user: User,
  ): Promise<Worker | UniversalResponseObject> {
    const worker = new Worker();

    const existingWorker = await this.workerDbValidatorService.isAssigned(data);
    if (!(typeof existingWorker === 'boolean')) return existingWorker;

    const userGivenToBeWorker =
      await this.workerDbValidatorService.checkGivenWorker(data);
    if (!(userGivenToBeWorker instanceof User)) return userGivenToBeWorker;

    const companyGivenToBeSigned = await this.companyDbValidatorService.isOwner(
      data,
      user,
    );
    if (!(companyGivenToBeSigned instanceof Company))
      return companyGivenToBeSigned;
    worker.user = userGivenToBeWorker;
    worker.isWorkerAtCompany = companyGivenToBeSigned;
    return worker;
  }
}
