import { Inject, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '../user/entities/user.entity';
import { Worker } from './entities/worker.entity';
import { UniversalResponseObject } from '../../types';
import { WorkerHelperService } from './worker-helper/worker-helper.service';

@Injectable()
export class WorkerService {
  constructor(
    @Inject(WorkerHelperService)
    private readonly workerHelper: WorkerHelperService,
  ) {}

  async createNew(data: CreateWorkerDto, user: User) {
    const createdWorker = await this.workerHelper.assignDataToWorker(
      data,
      user,
    );
    console.log(createdWorker);
    if (!(createdWorker instanceof Worker)) return createdWorker;
    return createdWorker
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }
}
