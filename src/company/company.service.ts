import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../user/entities/user.entity';
import { Company } from './entities/company.entity';
import { UniversalResponseObject } from '../../types';
import { TypeORMError } from 'typeorm';

@Injectable()
export class CompanyService {
  public async checkIfOwner(company: Company, user: User, message?: string) {
    if (
      !(await user.ownedCompanies).find(
        (oneCompany) => oneCompany.id === company.id,
      )
    )
      throw new HttpException(
        message ?? 'Given company not belong to user',
        HttpStatus.UNAUTHORIZED,
      );
    return true;
  }

  async create(data: CreateCompanyDto, user: User) {
    const company = new Company();
    company.name = data.name;
    company.description = data.description ?? null;
    company.owners = Promise.resolve([user]);

    if (await company.checkUnique('name'))
      throw new TypeORMError(
        'Company with given name has already been created',
      );

    return company
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('Cannot save');
      });
  }
}
