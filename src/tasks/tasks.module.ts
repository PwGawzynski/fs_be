import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskHelperService } from './task-helper/task-helper.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskHelperService],
})
export class TasksModule {}
