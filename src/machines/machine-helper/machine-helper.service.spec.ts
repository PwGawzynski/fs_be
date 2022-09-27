import { Test, TestingModule } from '@nestjs/testing';
import { MachineHelperService } from './machine-helper.service';

describe('MachineHelperService', () => {
  let service: MachineHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineHelperService],
    }).compile();

    service = module.get<MachineHelperService>(MachineHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
