import { Test, TestingModule } from '@nestjs/testing';
import { TaskHelperService } from './task-helper.service';

describe('TaskHelperService', () => {
  let service: TaskHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskHelperService],
    }).compile();

    service = module.get<TaskHelperService>(TaskHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
