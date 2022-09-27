import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { MachineDbValidatorService } from '../db-validators/machine-db-validator/machine-db-validator.service';
import { MachineHelperService } from './machine-helper/machine-helper.service';

@Module({
  imports: [MachineDbValidatorService],
  controllers: [MachinesController],
  providers: [MachinesService, MachineDbValidatorService, MachineHelperService],
})
export class MachinesModule {}
