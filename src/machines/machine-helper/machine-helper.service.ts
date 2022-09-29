import { Inject, Injectable } from '@nestjs/common';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { User } from '../../user/entities/user.entity';
import { Machine } from '../entities/machine.entity';
import { Company } from '../../company/entities/company.entity';
import { UniversalResponseObject } from '../../../types';
import { MachineDbValidatorService } from '../../db-validators/machine-db-validator/machine-db-validator.service';

@Injectable()
export class MachineHelperService {
  constructor(
    @Inject(MachineDbValidatorService)
    private readonly machineDbValidatorService: MachineDbValidatorService,
  ) {}
  public async assignDataToMachine(data: CreateMachineDto, user: User) {
    const machine = new Machine();

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
        message: 'Given company not belong to caller',
      } as UniversalResponseObject;

    machine.name = data.name;
    machine.brand = data.brand;
    machine.model = data.model;
    machine.registrationNumber = data.registrationNumber;
    machine.workedHours = data.workedHours;
    machine.belongToCompany = company;
    return machine;
  }
}
