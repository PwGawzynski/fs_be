import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, CompanyService],
  imports: [CompanyService],
})
export class TaskModule {}
