import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { UpdateTaskAddWorkersDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('client', 'owner')
  createNew(@Body() data: CreateTaskDto, @UserObj() user: User) {
    return this.tasksService.createNewTask(data, user);
  }

  @Put('/add-workers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner')
  updateWorkers(@Body() data: UpdateTaskAddWorkersDto, @UserObj() user: User) {
    return this.tasksService.signWorkers(data, user);
  }
}
