import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UniversalResponseObject, UserRole } from '../../types';
import { User } from '../user/entities/user.entity';
import { CreateNapDto } from './dto/create-nap.dto';
import { CheckDateOption, WorkDay } from '../work-day/entities/work-day.entity';
import { Nap } from './entities/nap.entity';
import { Worker } from '../worker/entities/worker.entity';

@Injectable()
export class NapService {
  async createNewNap(user: User, role: UserRole, data?: CreateNapDto) {
    const workDay = new WorkDay();
    switch (role) {
      case UserRole.worker:
        const worker = Worker.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!(await worker).isWorkerAtCompany)
          throw new HttpException(
            'Causer is bnot worker of any company',
            HttpStatus.BAD_REQUEST,
          );
        workDay.worker = worker;
        workDay.doneForCompany = (await worker).isWorkerAtCompany;
        if (!(await workDay.findForAndFill(CheckDateOption.ForPreviousDay)))
          throw new HttpException(
            'Cannot find any open work with can be connect with new nap',
            HttpStatus.BAD_REQUEST,
          );

        const nap = new Nap();
        nap.startDate = new Date();
        nap.workDay = Promise.resolve(workDay);
        (await workDay.naps).push(nap);
        return nap
          .save()
          .then(() =>
            workDay
              .save()
              .then(() => {
                return { status: true } as UniversalResponseObject;
              })
              .catch(() => {
                throw new TypeError('Cannot save');
              }),
          )
          .catch(() => {
            throw new TypeError('Cannot save');
          });
        break;
      case UserRole.owner:
    }
  }
}
