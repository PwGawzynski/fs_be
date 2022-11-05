import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { AssignWorkersDto } from './dto/update-task.dto';
import { UserRole } from '../../types';
import { GetUndoneTasksForDateDto } from './dto/getUndoneTasksForDate-dto';
import { StartTaskDto } from './dto/startTask-dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'client')
  create(@Body() data: CreateTaskDto, @UserObj() user: User) {
    return this.taskService.createNewTask(data, user);
  }

  @Put('/assign-workers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'client')
  assignWorkers(@Body() data: AssignWorkersDto, @UserObj() user: User) {
    return this.taskService.assignWorkers(data, user);
  }

  @Get('undone-for-date/:role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  getAllUndoneForDate(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @UserObj() user: User,
    @Body() data?: GetUndoneTasksForDateDto,
  ) {
    return this.taskService.getAllUndoneForDate(role, data, user);
  }

  @Post('start/:role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  startTask(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @UserObj() user: User,
    @Body() data?: StartTaskDto,
  ) {
    return this.taskService.startTask(role, data, user);
  }
}
