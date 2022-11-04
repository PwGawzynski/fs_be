import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Company } from '../company/entities/company.entity';
import {
  SerializedTaskResponse,
  UniversalResponseObject,
  UserRole,
} from '../../types';
import { TypeORMError } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { AssignWorkersDto } from './dto/update-task.dto';
import { Worker } from '../worker/entities/worker.entity';
import { GetUndoneTasksForDateDto } from './dto/getUndoneTasksForDate-dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}
  async createNewTask(data: CreateTaskDto, user: User) {
    const task = new Task();
    task.name = data.name;
    task.description = data.description ?? null;
    task.purchaser =
      Promise.resolve(data.purchaserID as unknown as User) ??
      Promise.resolve(user);
    task.company = Promise.resolve(data.companyID as unknown as Company);
    task.performanceDay = data.performanceDay ?? null;
    await this.companyService.checkIfOwner(await task.company, user);
    return task
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('Cannot save');
      });
  }

  async assignWorkers(data: AssignWorkersDto, user: User) {
    await this.companyService.checkIfOwner(
      await (data.TaskId as unknown as Task).company,
      user,
    );
    const userOwnedCompaniesIds = (await user.ownedCompanies).map(
      (company) => company.id,
    );
    if (
      (
        await Promise.all(
          (data.workersIDS as unknown as Worker[]).map(async (worker) => {
            const workerCompanyId = (await worker.isWorkerAtCompany).id;
            return !!userOwnedCompaniesIds.find(
              (userCompanyId) => userCompanyId === workerCompanyId,
            );
          }),
        )
      ).includes(false)
    )
      throw new HttpException(
        'One of given worker is not assigned with any of users company',
        HttpStatus.CONFLICT,
      );
    (data.TaskId as unknown as Task).workers = Promise.resolve(
      data.workersIDS as unknown as Worker[],
    );
    (data.TaskId as unknown as Task).workers = Promise.resolve(
      data.workersIDS as unknown as Worker[],
    );
    return (data.TaskId as unknown as Task)
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('Cannot save');
      });
  }

  async getAllUndoneForDate(
    role: UserRole,
    data: GetUndoneTasksForDateDto,
    user: User,
  ) {
    let tasks: Task[];
    let worker: Worker;
    switch (role) {
      case UserRole.worker:
        if (data.performanceDay ?? data.companyID ?? data.workerID)
          throw new HttpException(
            'Cannot serve request with body, when request as Worker',
            HttpStatus.CONFLICT,
          );
        worker = await Worker.FindByUserId(user.id);
        tasks = await Task.findAllByWorkerID(worker);
        break;
      case UserRole.owner:
        if (!(data.performanceDay ?? data.companyID ?? data.workerID))
          throw new HttpException(
            'All params must be defined when request as owner',
            HttpStatus.CONFLICT,
          );
        worker = data.workerID as unknown as Worker;
        await this.companyService.checkIfOwner(
          data.companyID as unknown as Company,
          user,
        );

        if (
          !(await user.ownedCompanies).find(
            async (company) =>
              company.id === (await worker.isWorkerAtCompany).id,
          )
        )
          throw new HttpException(
            'Worker is not assigned to any of your companies',
            HttpStatus.CONFLICT,
          );

        tasks = await Task.findAllByProperties({
          where: {
            performanceDay: data.performanceDay,
            company: { id: (data.companyID as unknown as Company).id },
            workers: {
              id: (data.workerID as unknown as Worker).id,
            },
          },
        });
        break;
    }
    const serializedTasks = tasks
      .filter((tasks) => !tasks.isDone)
      .map(
        (task) =>
          ({
            performanceDay: task.performanceDay,
            id: task.id,
            name: task.name,
            description: task.description,
          } as SerializedTaskResponse),
      );
    return {
      status: true,
      data: serializedTasks,
    } as UniversalResponseObject;
  }
}
