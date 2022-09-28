import { Test, TestingModule } from '@nestjs/testing';
import { WorkerDbValidatorService } from './worker-db-validator.service';

describe('WorkerDbValidatorService', () => {
  let service: WorkerDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkerDbValidatorService],
    }).compile();

    service = module.get<WorkerDbValidatorService>(WorkerDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
