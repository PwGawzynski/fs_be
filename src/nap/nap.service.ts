import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UniversalResponseObject, UserRole } from '../../types';
import { User } from '../user/entities/user.entity';
import { CreateNapDto } from './dto/create-nap.dto';
import {
  CheckDateOption,
  FindMethodOption,
  WorkDay,
} from '../work-day/entities/work-day.entity';
import { Nap } from './entities/nap.entity';
import { Worker } from '../worker/entities/worker.entity';
import { CompanyService } from '../company/company.service';
import { CloseNapDto } from './dto/closeNap.dto';

@Injectable()
export class NapService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}
  async createNewNap(user: User, role: UserRole, data?: CreateNapDto) {
    const workDay = new WorkDay();
    const nap = new Nap();

    switch (role) {
      case UserRole.worker:
        if (data && typeof data === 'object' && Object.keys(data).length)
          throw new HttpException(
            'Body is not allowed for this ask',
            HttpStatus.BAD_REQUEST,
          );
        await Nap.checkIfAnyIsOpen(new Date());
        const worker = Worker.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!(await worker).isWorkerAtCompany)
          throw new HttpException(
            'Causer is not worker of any company',
            HttpStatus.BAD_REQUEST,
          );
        workDay.worker = worker;
        workDay.doneForCompany = (await worker).isWorkerAtCompany;
        await workDay.findForAndFill(
          CheckDateOption.ForPreviousDay,
          'Cannot find any open work with can be connect with new nap',
          FindMethodOption.ForNullEndDate,
        );

        nap.startDate = new Date();
        nap.workDay = Promise.resolve(workDay);
        (await workDay.naps).push(nap);
        break;
      case UserRole.owner:
        if (!data.startDate)
          throw new HttpException(
            'Not enough parameters, Start date has not been given',
            HttpStatus.BAD_REQUEST,
          );

        await Nap.checkIfAnyIsOpen(data.startDate);

        await this.companyService.checkIfOwner(
          await (data.workDayId as unknown as WorkDay).doneForCompany,
          user,
          'You are not owner of this company',
        );

        nap.workDay = Promise.resolve(data.workDayId as unknown as WorkDay);
        nap.startDate = data.startDate;
        nap.endDate = data.endDate ?? null;

        break;
    }

    return nap
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeError('Cannot save');
      });
  }

  async closeNap(user: User, role: UserRole, data?: CloseNapDto) {
    let nap: Nap;
    switch (role) {
      case UserRole.worker:
        nap = await Nap.findOpenForDateOrReject(new Date());
        nap.endDate = new Date();
        break;
      case UserRole.owner:
        if (!data?.endDate)
          throw new HttpException(
            'End date param must be given for ask as owner',
            HttpStatus.BAD_REQUEST,
          );
        nap = data.napId as unknown as Nap;
        const workDay = await nap.workDay;
        if (!workDay)
          throw new HttpException(
            'Cannot find work day for given nap',
            HttpStatus.BAD_REQUEST,
          );
        await this.companyService.checkIfOwner(
          await workDay.doneForCompany,
          user,
          'Causer unauthorised, company issue',
        );
        nap.endDate = data.endDate;
    }
    return nap
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeError('Cannot save');
      });
  }
}
