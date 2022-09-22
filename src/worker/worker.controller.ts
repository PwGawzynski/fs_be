import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner')
  createWorker(@Body() data: CreateWorkerDto, @UserObj() user: User) {
    return this.workerService.createNew(data, user);
  }
}
