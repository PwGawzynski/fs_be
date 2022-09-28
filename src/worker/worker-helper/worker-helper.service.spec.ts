import { Test, TestingModule } from '@nestjs/testing';
import { WorkerHelperService } from './worker-helper.service';

describe('WorkerHelperService', () => {
  let service: WorkerHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkerHelperService],
    }).compile();

    service = module.get<WorkerHelperService>(WorkerHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
