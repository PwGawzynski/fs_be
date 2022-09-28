import { Module } from '@nestjs/common';
import { CompanyDbValidatorService } from './company-db-validator/company-db-validator.service';
import { TaskDbValidatorService } from './task-db-validator/task-db-validator.service';
import { UserDbValidatorService } from './user-db-validator/user-db-validator.service';
import { WorkerDbValidatorService } from './worker-db-validator/worker-db-validator.service';
import { FieldDbValidatorService } from './field-db-validator/field-db-validator.service';
import { MachineDbValidatorService } from './machine-db-validator/machine-db-validator.service';

@Module({
  providers: [
    CompanyDbValidatorService,
    TaskDbValidatorService,
    UserDbValidatorService,
    WorkerDbValidatorService,
    FieldDbValidatorService,
    MachineDbValidatorService,
  ],
  exports: [
    CompanyDbValidatorService,
    TaskDbValidatorService,
    UserDbValidatorService,
    WorkerDbValidatorService,
    FieldDbValidatorService,
    MachineDbValidatorService,
  ],
})
export class DbValidatorsModule {}
