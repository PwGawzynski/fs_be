import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { User } from '../user/entities/user.entity';
import { Machine } from './entities/machine.entity';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';

@Injectable()
export class MachinesService {
  private static async _assignDataToMachine(
    data: CreateMachineDto,
    user: User,
  ) {
    const machine = new Machine();
    machine.name = data.name;
    machine.brand = data.brand;
    machine.model = data.model;
    machine.registrationNumber = data.registrationNumber;
    machine.workedHours = data.workedHours;
    // TODO check if user given company and if yes sign that company
    const company = await Company.findOne({
      where: {
        owners: {
          id: user.id,
        },
      },
      relations: ['owners'],
    });
    if (!company) return undefined;
    machine.belongToCompany = company;
    return machine;
  }

  async createNewMachine(data: CreateMachineDto, user: User) {
    const createdMachine = await MachinesService._assignDataToMachine(
      data,
      user,
    );
    if (!createdMachine) return { status: false } as UniversalResponseObject;
    createdMachine.save();
    return { status: true } as UniversalResponseObject;
  }
}
