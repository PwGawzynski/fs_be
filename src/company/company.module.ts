import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyHelperService } from './company-helper/company-helper.service';
import { CompanyDbValidatorService } from '../db-validators/company-db-validator/company-db-validator.service';

@Module({
  imports: [CompanyDbValidatorService],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyHelperService, CompanyDbValidatorService],
})
export class CompanyModule {}
