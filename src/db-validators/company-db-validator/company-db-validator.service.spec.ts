import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDbValidatorService } from './company-db-validator.service';

describe('CompanyDbValidatorService', () => {
  let service: CompanyDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyDbValidatorService],
    }).compile();

    service = module.get<CompanyDbValidatorService>(CompanyDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
