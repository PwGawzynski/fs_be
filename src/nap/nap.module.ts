import { Module } from '@nestjs/common';
import { NapService } from './nap.service';
import { NapController } from './nap.controller';

@Module({
  controllers: [NapController],
  providers: [NapService]
})
export class NapModule {}
