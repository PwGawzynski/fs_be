import { Test, TestingModule } from '@nestjs/testing';
import { NapController } from './nap.controller';
import { NapService } from './nap.service';

describe('NapController', () => {
  let controller: NapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NapController],
      providers: [NapService],
    }).compile();

    controller = module.get<NapController>(NapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
