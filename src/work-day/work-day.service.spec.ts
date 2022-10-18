import { Test, TestingModule } from '@nestjs/testing';
import { WorkDayService } from './work-day.service';

describe('WorkDayService', () => {
  let service: WorkDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkDayService],
    }).compile();

    service = module.get<WorkDayService>(WorkDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
