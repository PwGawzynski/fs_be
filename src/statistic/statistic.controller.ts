import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { GetWorkerDailyDto } from './dto/get-worker-daily.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('worker/dailyDoneTasks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('worker', 'owner')
  doneTaskDailyStats(@Body() data: GetWorkerDailyDto, @UserObj() user: User) {
    return this.statisticService.workerDailyDoneTasks(data, user);
  }
}
