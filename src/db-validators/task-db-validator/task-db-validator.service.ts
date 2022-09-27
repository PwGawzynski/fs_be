import { Injectable } from '@nestjs/common';
import { Task } from '../../tasks/entities/task.entity';
import { UniversalResponseObject } from '../../../types';
import { User } from '../../user/entities/user.entity';
import { UpdateTaskAddWorkersDto } from '../../tasks/dto/update-task.dto';
import { Worker } from '../../worker/entities/worker.entity';
import { In } from 'typeorm';

@Injectable()
export class TaskDbValidatorService {
  public async find(id: string): Promise<Task | UniversalResponseObject> {
    const task = await Task.findOne({
      where: {
        id,
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

  public async checkIfTaskAssignedCompaniesAreUsers(
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
  public async checkIfWorkersOfCompanies(
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
}
