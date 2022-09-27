import { Test, TestingModule } from '@nestjs/testing';
import { TaskDbValidatorService } from './task-db-validator.service';

describe('TaskDbValidatorService', () => {
  let service: TaskDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskDbValidatorService],
    }).compile();

    service = module.get<TaskDbValidatorService>(TaskDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
