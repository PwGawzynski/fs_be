import { Test, TestingModule } from '@nestjs/testing';
import { CompanyHelperService } from './company-helper.service';

describe('CompanyHelperService', () => {
  let service: CompanyHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyHelperService],
    }).compile();

    service = module.get<CompanyHelperService>(CompanyHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
