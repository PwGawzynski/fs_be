import { Inject, Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { User } from '../user/entities/user.entity';
import { Machine } from './entities/machine.entity';
import { UniversalResponseObject } from '../../types';
import { MachineHelperService } from './machine-helper/machine-helper.service';

@Injectable()
export class MachinesService {
  constructor(
    @Inject(MachineHelperService)
    private readonly machineHelperService: MachineHelperService,
  ) {}

  async createNewMachine(data: CreateMachineDto, user: User) {
    const createdMachine = await this.machineHelperService.assignDataToMachine(
      data,
      user,
    );
    if (!(createdMachine instanceof Machine)) return createdMachine;
    return createdMachine
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }
}
