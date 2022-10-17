import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, CompanyService],
  imports: [CompanyService],
})
export class WorkerModule {}
