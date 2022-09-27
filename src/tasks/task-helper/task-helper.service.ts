import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from '../../user/entities/user.entity';
import { UniversalResponseObject } from '../../../types';
import { Company } from '../../company/entities/company.entity';
import { UpdateTaskAddWorkersDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { UserDbValidatorService } from '../../db-validators/user-db-validator/user-db-validator.service';
import { CompanyDbValidatorService } from '../../db-validators/company-db-validator/company-db-validator.service';
import { TaskDbValidatorService } from '../../db-validators/task-db-validator/task-db-validator.service';

@Injectable()
export class TaskHelperService {
  constructor(
    @Inject(UserDbValidatorService)
    private readonly userDbValidatorService: UserDbValidatorService,
    @Inject(CompanyDbValidatorService)
    private readonly companyDbValidatorService: CompanyDbValidatorService,
    @Inject(TaskDbValidatorService)
    private readonly taskDbValidatorService: TaskDbValidatorService,
  ) {}

  private static async _checkIfNotOwner(
    user: User,
    company: Company,
  ): Promise<UniversalResponseObject | false> {
    if (!(company?.owners?.length && user?.id))
      return {
        status: false,
        message: 'Request causer is not owner of given company',
      } as UniversalResponseObject;

    if (!company.owners.map((owner) => owner.id).find((e) => e === user.id))
      return {
        status: false,
        message: 'Request causer is not owner of given company',
      } as UniversalResponseObject;
    return false;
  }

  public async _assignDataToTask(
    data: CreateTaskDto,
    user: User,
  ): Promise<Task | UniversalResponseObject> {
    const task = new Task();
    task.name = data.name;
    task.description = data.description ? data.description : null;
    if (!data.purchaserID) task.purchaser = user;
    else {
      const foundPurchaser = await this.userDbValidatorService.existInDb(
        data.purchaserID,
        'Given purchaser has not been found',
      );
      if (!(foundPurchaser instanceof User)) return foundPurchaser;
      task.purchaser = foundPurchaser;
    }
    const company = await this.companyDbValidatorService.findWOwners(
      data.companyID,
    );
    if (!(company instanceof Company)) return company;

    const isOwner = await TaskHelperService._checkIfNotOwner(user, company);
    if (isOwner) return isOwner;

    task.company = company;
    task.performanceDay = data.performanceDay ? data.performanceDay : null;
    return task;
  }

  public async _findAndSignWorkers(
    data: UpdateTaskAddWorkersDto,
    user: User,
  ): Promise<Task | UniversalResponseObject> {
    const task = await this.taskDbValidatorService.find(data.TaskId);
    if (!(task instanceof Task)) return task;

    const userWCompanies =
      await this.taskDbValidatorService.checkIfTaskAssignedCompaniesAreUsers(
        user,
        task,
      );
    if (!(userWCompanies instanceof User)) return userWCompanies;

    const workers = await this.taskDbValidatorService.checkIfWorkersOfCompanies(
      data,
      task,
    );
    if (!Array.isArray(workers)) return workers;

    task.workers = workers;
    return task;
  }
}
