import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';
import { TypeORMError } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { AssignWorkersDto } from './dto/update-task.dto';
import { Worker } from '../worker/entities/worker.entity';

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
}
