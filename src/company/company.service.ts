import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject } from '../../types';

@Injectable()
export class CompanyService {
  private static async isUniqueEntity(
    field: string,
    value: string,
  ): Promise<boolean | UniversalResponseObject> {
    return (
      await Company.find({
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

  private static async _assignDataToEntity(
    data: CreateCompanyDto,
    user: User,
  ): Promise<Company | UniversalResponseObject> {
    const company = new Company();

    // check if given company name is unique
    const validationNameResult = await CompanyService.isUniqueEntity(
      'name',
      data.name,
    );
    if (!(typeof validationNameResult === 'boolean'))
      return validationNameResult;

    company.name = data.name;
    company.description = data.description ? data.description : null;
    company.machines = null;
    company.owners = [user];
    company.tasks = null;
    return company;
  }

  async createCompany(data: CreateCompanyDto, user: User) {
    const createdCompany = await CompanyService._assignDataToEntity(data, user);
    console.log(createdCompany);
    if (!(createdCompany instanceof Company)) return createdCompany;
    createdCompany.save();

    return { status: true } as UniversalResponseObject;
  }
}
