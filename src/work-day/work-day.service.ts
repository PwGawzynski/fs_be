import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateWorkDayDto } from './dto/create-work-day.dto';
import { User } from '../user/entities/user.entity';
import {
  GetCurrentlyOpenWorkDayRes,
  UniversalResponseObject,
  UserRole,
} from '../../types';
import {
  CheckDateOption,
  FindMethodOption,
  WorkDay,
} from './entities/work-day.entity';
import { Worker } from '../worker/entities/worker.entity';
import { IsNull, TypeORMError } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';
import { GetWorkDayDto } from './dto/get-work-day.dto';
import { CloseWorkDayDto } from './dto/close-work-day.dto';
import { GetDatesBetweenForQuery } from '../utils/beetwen-dates';
import { NapResObj } from '../../types/Nap/NapResObj';

@Injectable()
export class WorkDayService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}
  async createNewWorkDay(data: CreateWorkDayDto, user: User, role: UserRole) {
    const workDay = new WorkDay();

    switch (role) {
      case UserRole.worker:
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

        break;
      case UserRole.owner:
        if (!data.workerId || !data.companyId || !data.startDate)
          throw new HttpException(
            'Not enough parameters, has been given',
            HttpStatus.BAD_REQUEST,
          );
        await this.companyService.checkIfOwner(
          data.companyId as unknown as Company,
          user,
        );
        await this.companyService.checkIfOwner(
          await (data.workerId as unknown as Worker).isWorkerAtCompany,
          user,
          'Causer is not owner of company signed to given worker',
        );
        workDay.startDate = data.startDate ?? new Date();
        workDay.endDate = data.endDate ?? null;
        workDay.doneForCompany = Promise.resolve(
          data.companyId as unknown as Company,
        );
        workDay.worker = Promise.resolve(data.workerId as unknown as Worker);
        break;
    }

    await workDay.checkIfAlreadyBeenCreated(
      role === UserRole.owner
        ? CheckDateOption.ForGivenDay
        : CheckDateOption.ForPreviousDay,
      FindMethodOption.ForNullEndDate,
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

  async getOpenWorkDay(role: UserRole, data: GetWorkDayDto, user: User) {
    const workDay = new WorkDay();
    switch (role) {
      case UserRole.worker:
        workDay.worker = Worker.findOne({
          where: {
            user: {
              id: user.id,
            },
          },
        });
        if (!(await workDay.worker))
          throw new HttpException(
            'Causer is not worker of anny company',
            HttpStatus.BAD_REQUEST,
          );
        workDay.doneForCompany = (await workDay.worker).isWorkerAtCompany;
        await workDay.findForAndFill(
          CheckDateOption.ForPreviousDay,
          'Any open work day dont exist',
          FindMethodOption.ForNullEndDate,
        );
        break;
      case UserRole.owner:
        await this.companyService.checkIfOwner(
          await (data.workerId as unknown as Worker).isWorkerAtCompany,
          user,
        );
        if (!data.startDate)
          throw new HttpException(
            'Start Date param must be given for ask as owner',
            HttpStatus.BAD_REQUEST,
          );
        workDay.startDate = data.startDate;
        workDay.worker = Promise.resolve(data.workerId as unknown as Worker);
        workDay.doneForCompany = (
          data.workerId as unknown as Worker
        ).isWorkerAtCompany;
        await workDay.findForAndFill(
          CheckDateOption.ForGivenDay,
          'Cannot find any open work day for given params',
          FindMethodOption.ForEnyEndDate,
        );
    }

    return {
      status: true,
      data: {
        startDate: workDay.startDate,
        id: workDay.id,
        naps: (await workDay.naps).map((nap) => {
          return {
            id: nap.id,
            startDate: nap.startDate,
            endDate: nap.endDate,
          } as NapResObj;
        }),
      } as GetCurrentlyOpenWorkDayRes,
    } as UniversalResponseObject;
  }

  async closeWorkDay(role: UserRole, data: CloseWorkDayDto, user: User) {
    let workDay: WorkDay;
    switch (role) {
      case UserRole.worker:
        workDay = await WorkDay.findOne({
          where: {
            worker: {
              user: {
                id: user.id,
              },
            },
            startDate: GetDatesBetweenForQuery(new Date(), new Date()),
            endDate: IsNull(),
          },
        });
        if (!workDay)
          throw new HttpException(
            'Cannot find work day open for today connect with causer',
            HttpStatus.BAD_REQUEST,
          );
        workDay.endDate = new Date();
        console.log(workDay);
        break;
      case UserRole.owner:
        workDay = data.workDayId as unknown as WorkDay;
        await this.companyService.checkIfOwner(
          await workDay.doneForCompany,
          user,
          'Causer is not owner of company assigned to given work day',
        );
        workDay.endDate = data.endDate ?? new Date();
        if (workDay.startDate >= workDay.endDate)
          throw new HttpException(
            'End date cannot be les than start date',
            HttpStatus.BAD_REQUEST,
          );
    }

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
