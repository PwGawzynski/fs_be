import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  UseGuards,
} from '@nestjs/common';
import { StatisticService, Stats } from './statistic.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { WorkerIdToEntity } from '../pipes/workerIdToEntity.pipe';
import { Worker } from '../worker/entities/worker.entity';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../types';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get(':role/daily-done-task/:workerId?')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  getDailyStats(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @UserObj() user: User,
    @Param('workerId', WorkerIdToEntity) worker?: Worker | undefined,
  ) {
    return this.statisticService.getDoneTask(worker, user, role, Stats.daily);
  }
  @Get(':role/all-done-task/:workerId?')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  getDoneTaskStats(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @UserObj() user: User,
    @Param('workerId', WorkerIdToEntity) worker?: Worker | undefined,
  ) {
    return this.statisticService.getDoneTask(worker, user, role, Stats.all);
  }
}
