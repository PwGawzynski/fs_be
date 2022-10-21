import { Module } from '@nestjs/common';
import { NapService } from './nap.service';
import { NapController } from './nap.controller';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [NapController],
  providers: [NapService, CompanyService],
  imports: [CompanyService],
})
export class NapModule {}
