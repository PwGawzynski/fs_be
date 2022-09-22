import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';
import { UpdateTaskAddWorkersDto } from './dto/update-task.dto';
import { In } from 'typeorm';
import { Worker } from '../worker/entities/worker.entity';

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
    user: User,
  ): Promise<Task | UniversalResponseObject> {
    // TODO think if it is possible to modify tasks with dont below to user
    const task = await Task.findOne({
      where: {
        id: data.TaskId,
      },
      relations: ['company'],
    });
    if (!task)
      return {
        status: false,
        message: 'Cannot find task with given id',
      } as UniversalResponseObject;

    const userWCompanies = await User.findOne({
      where: {
        id: user.id,
      },
      relations: ['ownedCompanies'],
    });
    console.log(userWCompanies);
    if (
      !userWCompanies.ownedCompanies.filter(
        (company) => company.id === task.company.id,
      ).length
    )
      return {
        status: false,
        message:
          'Ask causer is not over of company with is signed to this task',
      } as UniversalResponseObject;

    const workers = await Worker.find({
      where: {
        user: {
          id: In(data.workersIDS),
        },
      },
      relations: ['user', 'isWorkerAtCompany'],
    });

    const notInDb = (
      data.workersIDS.map(
        (id) => !!workers.find((worker) => worker.user.id === id) || id,
      ) as Array<boolean | string>
    ).filter((e) => typeof e !== 'boolean');

    if (notInDb.length)
      return {
        status: false,
        message:
          "Users (workers) with given ids haven't been found " +
          notInDb.join(','),
      } as UniversalResponseObject;
    console.log(workers);
    const outOfTaskCompany = workers
      .filter((worker) => !(worker.isWorkerAtCompany.id === task.company.id))
      .map((worker) => worker.id);

    if (outOfTaskCompany.length)
      return {
        status: false,
        message:
          "'Workers with these id's: " +
          outOfTaskCompany.join(',') +
          ' are employed in company with is not assigned to given task',
      } as UniversalResponseObject;
    console.log(outOfTaskCompany, 'OUT OF COMPANY');
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

  async signWorkers(data: UpdateTaskAddWorkersDto, user: User) {
    const updatedTask = await this._findAndSignWorkers(data, user);
    console.log(updatedTask);
    if (!(updatedTask instanceof Task)) return updatedTask;
    updatedTask.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }
}
