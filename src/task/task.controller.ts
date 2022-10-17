import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { AssignWorkersDto } from './dto/update-task.dto';

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
}
