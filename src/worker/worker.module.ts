import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { WorkerHelperService } from './worker-helper/worker-helper.service';
import { WorkerDbValidatorService } from '../db-validators/worker-db-validator/worker-db-validator.service';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';

@Module({
  imports: [CompanyDbValidatorService],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    WorkerHelperService,
    WorkerDbValidatorService,
    CompanyDbValidatorService,
  ],
})
export class WorkerModule {}
