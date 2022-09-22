import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject } from '../../types';

@Injectable()
export class CompanyService {
  private static _assignDataToEntity(
    data: CreateCompanyDto,
    user: User,
  ): Company | undefined {
    const company = new Company();
    company.name = data.name;
    company.description = data.description ? data.description : null;
    company.machines = null;
    company.owners = [user];
    company.tasks = null;
    return company;
  }

  async createCompany(data: CreateCompanyDto, user: User) {
    const createdCompany = CompanyService._assignDataToEntity(data, user);
    if (!createdCompany) return { status: false } as UniversalResponseObject;
    createdCompany.save();

    return { status: true } as UniversalResponseObject;
  }
}
