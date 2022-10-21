import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateWorkDayDto } from './dto/create-work-day.dto';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject, UserRole } from '../../types';
import { CheckDateOption, WorkDay } from './entities/work-day.entity';
import { Worker } from '../worker/entities/worker.entity';
import { TypeORMError } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';

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
