import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskHelperService } from './task-helper/task-helper.service';
import { TaskDbValidatorService } from '../db-validators/task-db-validator/task-db-validator.service';
import { UserDbValidatorService } from '../db-validators/user-db-validator/user-db-validator.service';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';

@Module({
  imports: [
    TaskDbValidatorService,
    UserDbValidatorService,
    UserDbValidatorService,
    CompanyDbValidatorService,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskHelperService,
    TaskDbValidatorService,
    UserDbValidatorService,
    CompanyDbValidatorService,
  ],
})
export class TasksModule {}
