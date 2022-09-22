import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';
import { UpdateTaskAddWorkersDto } from './dto/update-task.dto';
import { In } from 'typeorm';

@Injectable()
export class TasksService {
  // TODO change it because it might cause issues cause of instance per ask
  private rejectionCause: string;

  private async _assignDataToTask(
    data: CreateTaskDto,
    user: User,
  ): Promise<Task | undefined> {
    const task = new Task();
    task.name = data.name;
    task.description = data.description ? data.description : null;
    if (!data.purchaserID) task.purchaser = user;
    else {
      const purchaser = await User.findOne({
        where: {
          id: data.purchaserID,
        },
      });
      if (!purchaser) {
        this.rejectionCause = 'Cannot find given purchaser in DB';
        return undefined;
      }
      task.purchaser = purchaser;
    }
    console.log(task.purchaser);
    const company = await Company.findOne({
      where: {
        id: data.companyID,
      },
    });
    if (!company) {
      this.rejectionCause = 'Cannot find given company';
      return undefined;
    }
    task.company = company;

    task.performanceDay = data.performanceDay ? data.performanceDay : null;

    return task;
  }

  // TODO check if given worker is signed to company
  private async _findAndSignWorkers(
    data: UpdateTaskAddWorkersDto,
  ): Promise<Task | UniversalResponseObject> {
    // TODO think if it is possible to modify tasks with dont below to user
    const task = await Task.findOne({
      where: {
        id: data.TaskId,
      },
    });
    if (!task)
      return {
        status: false,
        message: 'Cannot find task with given id',
      } as UniversalResponseObject;

    const workers = await User.find({
      where: {
        id: In(data.workersIDS),
      },
    });

    const notInDb = (
      data.workersIDS.map(
        (id) => !!workers.find((worker) => worker.id === id) || id,
      ) as Array<boolean | string>
    ).filter((e) => typeof e !== 'boolean');
    console.log(notInDb.length);
    if (notInDb.length)
      return {
        status: false,
        message: "Users with given ids haven't been found " + notInDb.join(','),
      } as UniversalResponseObject;
    task.workers = workers;
    return task;
  }

  async createNewTask(data: CreateTaskDto, user: User) {
    const createdTask = await this._assignDataToTask(data, user);
    if (!createdTask)
      return {
        status: false,
        message: this.rejectionCause,
      } as UniversalResponseObject;
    createdTask.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }

  async signWorkers(data: UpdateTaskAddWorkersDto) {
    const updatedTask = await this._findAndSignWorkers(data);
    console.log(updatedTask);
    if (!(updatedTask instanceof Task)) return updatedTask;
    updatedTask.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }
}
