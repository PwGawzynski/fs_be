import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '../user/entities/user.entity';
import { Worker } from './entities/worker.entity';
import { UniversalResponseObject } from '../../types';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class WorkerService {
  private static async _assignDataToWorker(
    data: CreateWorkerDto,
    user: User,
  ): Promise<Worker | UniversalResponseObject> {
    const worker = new Worker();

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

    const userGivenToBeWorker = await User.findOne({
      where: {
        id: data.userID,
      },
    });
    if (!userGivenToBeWorker)
      return {
        status: false,
        message:
          "User with given id with would be use to assign to worker doesn't exist",
      } as UniversalResponseObject;
    const companyGivenToBeSigned = await Company.findOne({
      where: {
        id: data.companyID,
      },
      relations: ['owners'],
    });
    if (!companyGivenToBeSigned)
      return {
        status: false,
        message: `Company with given id doesn't exist`,
      } as UniversalResponseObject;

    if (
      !companyGivenToBeSigned.owners.filter((owner) => owner.id === user.id)
        .length
    )
      return {
        status: false,
        message: 'You are not owner of this company',
      } as UniversalResponseObject;
    worker.user = userGivenToBeWorker;
    worker.isWorkerAtCompany = companyGivenToBeSigned;
    return worker;
  }

  async createNew(data: CreateWorkerDto, user: User) {
    const createdWorker = await WorkerService._assignDataToWorker(data, user);
    console.log(createdWorker);
    if (!(createdWorker instanceof Worker)) return createdWorker;
    createdWorker.save();
    return {
      status: true,
    } as UniversalResponseObject;
  }
}
