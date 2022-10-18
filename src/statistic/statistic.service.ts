import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Worker } from '../worker/entities/worker.entity';
import { CompanyService } from '../company/company.service';
import { User } from '../user/entities/user.entity';
import { DailyTaskStats, UniversalResponseObject, UserRole } from '../../types';
import { Task } from '../task/entities/task.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class StatisticService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}

  private async _queryTask(workerCompany: Company, worker: Worker) {
    const tasks = await Task.find({
      where: {
        company: {
          id: workerCompany.id,
        },
      },
    });
    return (
      await Promise.all(
        tasks.map(async (task) => {
          return (await task.workers)
            .map((worker) => worker.id)
            .includes(worker.id)
            ? task
            : false;
        }),
      )
    ).filter(
      (dbFound) =>
        dbFound &&
        dbFound.performanceDay.toDateString() === new Date().toDateString(),
    ) as Task[];
  }

  async getDailyDoneTask(worker: Worker, user: User, role: UserRole) {
    let validatedTasks;
    if (role === UserRole.owner) {
      if (!worker)
        throw new HttpException(
          'WorkerId is obligatory when ask as owner',
          HttpStatus.BAD_REQUEST,
        );
      const workerCompany = await worker.isWorkerAtCompany;
      await this.companyService.checkIfOwner(workerCompany, user);
      // change it to simple query for performance
      validatedTasks = await this._queryTask(workerCompany, worker);
    } else if (role === UserRole.worker) {
      const worker = await Worker.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
      });
      if (!worker)
        throw new HttpException(
          'Causer is not worker',
          HttpStatus.UNAUTHORIZED,
        );
      validatedTasks = await this._queryTask(
        await worker.isWorkerAtCompany,
        worker,
      );
    }
    return {
      status: true,
      data: {
        done: validatedTasks.filter((task) => task.isDone).length,
        undone: validatedTasks.filter((task) => !task.isDone).length,
      } as DailyTaskStats,
    } as UniversalResponseObject;
  }
}
