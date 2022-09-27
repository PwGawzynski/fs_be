import { Test, TestingModule } from '@nestjs/testing';
import { FieldHelperService } from './field-helper.service';

describe('FieldHelperService', () => {
  let service: FieldHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldHelperService],
    }).compile();

    service = module.get<FieldHelperService>(FieldHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
