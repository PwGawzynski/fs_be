import { Test, TestingModule } from '@nestjs/testing';
import { NapService } from './nap.service';

describe('NapService', () => {
  let service: NapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NapService],
    }).compile();

    service = module.get<NapService>(NapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
