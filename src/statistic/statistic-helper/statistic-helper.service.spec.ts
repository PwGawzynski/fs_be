import { Test, TestingModule } from '@nestjs/testing';
import { StatisticHelperService } from './statistic-helper.service';

describe('StatisticHelperService', () => {
  let service: StatisticHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticHelperService],
    }).compile();

    service = module.get<StatisticHelperService>(StatisticHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
