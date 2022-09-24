import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { User } from '../user/entities/user.entity';
import { Machine } from './entities/machine.entity';
import { Company } from '../company/entities/company.entity';
import { UniversalResponseObject } from '../../types';

@Injectable()
export class MachinesService {
  private static async isUniqueEntity(
    field: string,
    value: string,
  ): Promise<boolean | UniversalResponseObject> {
    return (
      await Machine.find({
        where: {
          [field]: value,
        },
      })
    ).length
      ? ({
          status: false,
          message: `Given ${field} is not unique`,
        } as UniversalResponseObject)
      : true;
  }

  private static async _assignDataToMachine(
    data: CreateMachineDto,
    user: User,
  ) {
    const machine = new Machine();

    const nameValidationResult = await MachinesService.isUniqueEntity(
      'name',
      data.name,
    );
    if (!(typeof nameValidationResult === 'boolean'))
      return nameValidationResult;

    const registrationValidationResult = await MachinesService.isUniqueEntity(
      'registrationNumber',
      data.registrationNumber,
    );
    if (!(typeof registrationValidationResult === 'boolean'))
      return registrationValidationResult;

    const company = (
      await Company.find({
        where: {
          owners: {
            id: user.id,
          },
        },
        relations: ['owners'],
      })
    ).find((company) => company.id === data.companyID);
    if (!company)
      return {
        status: false,
        message: 'Given company not belong to caller or not exist',
      } as UniversalResponseObject;

    machine.name = data.name;
    machine.brand = data.brand;
    machine.model = data.model;
    machine.registrationNumber = data.registrationNumber;
    machine.workedHours = data.workedHours;
    machine.belongToCompany = company;
    return machine;
  }

  async createNewMachine(data: CreateMachineDto, user: User) {
    const createdMachine = await MachinesService._assignDataToMachine(
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
