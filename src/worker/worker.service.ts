import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '../user/entities/user.entity';
import { Worker } from './entities/worker.entity';
import { UniversalResponseObject } from '../../types';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class WorkerService {
  private static async _checkIfGivenAlreadyExist(
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

  private static async _checkUserToBEWorker(
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
          "User with given id with would be use to assign to worker doesn't exist",
      } as UniversalResponseObject;
    return userGivenToBeWorker;
  }

  private static async _checkCompany(
    data: CreateWorkerDto,
    user: User,
  ): Promise<Company | UniversalResponseObject> {
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
    return companyGivenToBeSigned;
  }

  private static async _assignDataToWorker(
    data: CreateWorkerDto,
    user: User,
  ): Promise<Worker | UniversalResponseObject> {
    const worker = new Worker();

    const existingWorker = await WorkerService._checkIfGivenAlreadyExist(data);
    if (!(typeof existingWorker === 'boolean')) return existingWorker;

    const userGivenToBeWorker = await WorkerService._checkUserToBEWorker(data);
    if (!(userGivenToBeWorker instanceof User)) return userGivenToBeWorker;

    const companyGivenToBeSigned = await WorkerService._checkCompany(
      data,
      user,
    );
    if (!(companyGivenToBeSigned instanceof Company))
      return companyGivenToBeSigned;
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
