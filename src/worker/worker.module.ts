import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
