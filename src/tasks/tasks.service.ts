import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';
import { UniversalResponseObject } from '../../types';
import { UpdateTaskAddWorkersDto } from './dto/update-task.dto';
import { TaskHelperService } from './task-helper/task-helper.service';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TaskHelperService)
    private readonly taskHelperService: TaskHelperService,
  ) {}

  async createNewTask(data: CreateTaskDto, user: User) {
    const createdTask = await this.taskHelperService._assignDataToTask(
      data,
      user,
    );
    if (!(createdTask instanceof Task)) return createdTask;
    return createdTask
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }

  async signWorkers(data: UpdateTaskAddWorkersDto, user: User) {
    const updatedTask = await this.taskHelperService._findAndSignWorkers(
      data,
      user,
    );
    if (!(updatedTask instanceof Task)) return updatedTask;
    // 'cause exception handling, it should be written like this
    return updatedTask
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }
}
