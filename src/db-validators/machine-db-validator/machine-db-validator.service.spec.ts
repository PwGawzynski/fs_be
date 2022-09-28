import { Test, TestingModule } from '@nestjs/testing';
import { MachineDbValidatorService } from './machine-db-validator.service';

describe('MachineDbValidatorService', () => {
  let service: MachineDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineDbValidatorService],
    }).compile();

    service = module.get<MachineDbValidatorService>(MachineDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
