import { Test, TestingModule } from '@nestjs/testing';
import { UserDbValidatorService } from './user-db-validator.service';

describe('UserDbValidatorService', () => {
  let service: UserDbValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDbValidatorService],
    }).compile();

    service = module.get<UserDbValidatorService>(UserDbValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
