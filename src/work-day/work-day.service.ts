import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDayDto } from './dto/create-work-day.dto';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject, UserRole } from '../../types';
import { WorkDay } from './entities/work-day.entity';
import { Worker } from '../worker/entities/worker.entity';
import { TypeORMError } from 'typeorm';

@Injectable()
export class WorkDayService {
  async createNewWorkDay(data: CreateWorkDayDto, user: User, role: UserRole) {
    switch (role) {
      case UserRole.worker:
        const workDay = new WorkDay();
        const worker = await Worker.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        workDay.startDate = new Date();
        workDay.doneForCompany = worker.isWorkerAtCompany;
        workDay.worker = Promise.resolve(worker);
        if (await workDay.checkIfAlreadyBeenCreated())
          throw new HttpException(
            'You have already open work day for today',
            HttpStatus.CONFLICT,
          );

        return workDay
          .save()
          .then(() => {
            return { status: true } as UniversalResponseObject;
          })
          .catch(() => {
            throw new TypeORMError('Cannot save');
          });
    }
  }
}
