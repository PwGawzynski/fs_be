import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [MachineController],
  providers: [MachineService, CompanyService],
  imports: [CompanyService],
})
export class MachineModule {}
