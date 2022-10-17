import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { User } from '../user/entities/user.entity';
import { Machine } from './entities/machine.entity';
import { UniversalResponseObject } from '../../types';
import { TypeORMError } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class MachineService {
  constructor(
    @Inject(CompanyService) private readonly companyService: CompanyService,
  ) {}
  async createNewMachine(data: CreateMachineDto, user: User) {
    const machine = new Machine();
    machine.name = data.name;
    machine.brand = data.brand;
    machine.model = data.model;
    machine.workedHours = data.workedHours ?? null;
    machine.registrationNumber = data.registrationNumber;
    if (!(await machine.unique('registrationNumber')))
      throw new HttpException(
        'Machine registration number must be unique',
        HttpStatus.CONFLICT,
      );
    machine.belongToCompany = Promise.resolve(
      data.companyID as unknown as Company,
    );

    await this.companyService.checkIfOwner(await machine.belongToCompany, user);

    return machine
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('Cannot save');
      });
  }
}
