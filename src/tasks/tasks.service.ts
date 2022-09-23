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
  private static async _isPurchaserInDB(
    data: CreateTaskDto,
  ): Promise<User | UniversalResponseObject> {
    const purchaser = await User.findOne({
      where: {
        id: data.purchaserID,
      },
    });
    if (!purchaser)
      return {
        status: false,
        message: 'Cannot find given purchaser in DB',
      } as UniversalResponseObject;
    return purchaser;
  }

  private static async _isCompanyInDB(
    data: CreateTaskDto,
  ): Promise<Company | UniversalResponseObject> {
    const company = await Company.findOne({
      where: {
        id: data.companyID,
      },
    });
    if (!company)
      return {
        status: false,
        message: 'Cannot find given company',
      } as UniversalResponseObject;
    return company;
  }

  private static async _checkIfNotOwner(
    user: User,
    company: Company,
  ): Promise<UniversalResponseObject | false> {
    if (!(company?.owners && user?.id))
      return {
        status: false,
        message: 'Request causer is not owner of given company',
      } as UniversalResponseObject;
    if (!(user.id in company.owners.map((owner) => owner.id)))
      return {
        status: false,
        message: 'Request causer is not owner of given company',
      } as UniversalResponseObject;
    return false;
  }

  private static async _findTask(
    data: UpdateTaskAddWorkersDto,
  ): Promise<Task | UniversalResponseObject> {
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
    return task;
  }

  private static async _findUserCompanies(
    data: UpdateTaskAddWorkersDto,
    user: User,
    task: Task,
  ): Promise<User | UniversalResponseObject> {
    const userWCompanies = await User.findOne({
      where: {
        id: user.id,
      },
      relations: ['ownedCompanies'],
    });
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
    return userWCompanies;
  }

  private static async _notWorkerInDB(
    data: UpdateTaskAddWorkersDto,
    task: Task,
  ): Promise<Worker[] | UniversalResponseObject> {
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
          "Users with given id's " + notInDb.join(',') + 'Does not exist ',
      } as UniversalResponseObject;
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
    return workers;
  }

  private static async _assignDataToTask(
    data: CreateTaskDto,
    user: User,
  ): Promise<Task | UniversalResponseObject> {
    const task = new Task();
    task.name = data.name;
    task.description = data.description ? data.description : null;
    if (!data.purchaserID) task.purchaser = user;
    else {
      const foundPurchaser = await TasksService._isPurchaserInDB(data);
      if (!(foundPurchaser instanceof User)) return foundPurchaser;
      task.purchaser = foundPurchaser;
    }
    const company = await TasksService._isCompanyInDB(data);
    if (!(company instanceof Company)) return company;

    const isOwner = await TasksService._checkIfNotOwner(user, company);
    if (isOwner) return isOwner;

    task.company = company;
    task.performanceDay = data.performanceDay ? data.performanceDay : null;
    return task;
  }

  // TODO cleanUp fnBelow
  private static async _findAndSignWorkers(
    data: UpdateTaskAddWorkersDto,
    user: User,
  ): Promise<Task | UniversalResponseObject> {
    const task = TasksService._findTask(data);
    if (!(task instanceof Task)) return task;

    const userWCompanies = await TasksService._findUserCompanies(
      data,
      user,
      task,
    );
    if (!(userWCompanies instanceof User)) return userWCompanies;

    const workers = await TasksService._notWorkerInDB(data, task);
    if (!Array.isArray(workers)) return workers;

    task.workers = workers;
    return task;
  }

  async createNewTask(data: CreateTaskDto, user: User) {
    const createdTask = await TasksService._assignDataToTask(data, user);
    if (!(createdTask instanceof Task)) return createdTask;
    createdTask.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }

  async signWorkers(data: UpdateTaskAddWorkersDto, user: User) {
    const updatedTask = await TasksService._findAndSignWorkers(data, user);
    console.log(updatedTask);
    if (!(updatedTask instanceof Task)) return updatedTask;
    updatedTask.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }
}
