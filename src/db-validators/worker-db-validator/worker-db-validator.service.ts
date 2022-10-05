import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from '../../worker/dto/create-worker.dto';
import { UniversalResponseObject } from '../../../types';
import { Worker } from '../../worker/entities/worker.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class WorkerDbValidatorService {
  public async isAssigned(
    data: CreateWorkerDto,
  ): Promise<UniversalResponseObject | false> {
    if (
      await Worker.findOne({
        where: {
          user: {
            id: data.userID,
          },
        },
        relations: ['user'],
      })
    )
      return {
        status: false,
        message: 'Given user has been already assigned',
      } as UniversalResponseObject;
    return false;
  }

  public async checkGivenWorker(
    data: CreateWorkerDto,
  ): Promise<User | UniversalResponseObject> {
    const userGivenToBeWorker = await User.findOne({
      where: {
        id: data.userID,
      },
    });
    if (!userGivenToBeWorker)
      return {
        status: false,
        message:
          "User with given id ( with would be use to assign to worker ) doesn't exist",
      } as UniversalResponseObject;
    return userGivenToBeWorker;
  }

  public getWorkerWithCompany(id: string) {
    return Worker.findOne({
      where: {
        id,
      },
      relations: ['isWorkerAtCompany'],
    });
  }
}
