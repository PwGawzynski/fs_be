import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Worker } from './entities/worker.entity';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { CompanyService } from '../company/company.service';
import { UniversalResponseObject } from '../../types';
import { TypeORMError } from 'typeorm';

@Injectable()
export class WorkerService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}

  async createAndAssign(data: CreateWorkerDto, user: User) {
    const worker = new Worker();
    worker.user = Promise.resolve(data.userID as unknown as User);
    await this.companyService.checkIfOwner(
      data.companyID as unknown as Company,
      user,
    );
    console.log(!(await worker.unique('user')), 'tututut');
    if (!(await worker.unique('user')))
      throw new TypeORMError(
        'This user has already been signed to another company',
      );
    worker.isWorkerAtCompany = Promise.resolve(
      data.companyID as unknown as Company,
    );
    return worker
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('cannot save');
      });
  }
}
