import { Test, TestingModule } from '@nestjs/testing';
import { FieldDbValidatorService } from './field-db-validator.service';

describe('FieldDbValidatorService', () => {
  let service: FieldDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldDbValidatorService],
    }).compile();

    service = module.get<FieldDbValidatorService>(FieldDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
