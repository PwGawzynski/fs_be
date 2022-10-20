import { Test, TestingModule } from '@nestjs/testing';
import { WorkDayController } from './work-day.controller';
import { WorkDayService } from './work-day.service';

describe('WorkDayController', () => {
  let controller: WorkDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkDayController],
      providers: [WorkDayService],
    }).compile();

    controller = module.get<WorkDayController>(WorkDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
