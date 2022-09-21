import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';

@Injectable()
export class TasksService {
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
}
