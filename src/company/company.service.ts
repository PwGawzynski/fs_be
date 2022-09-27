import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject } from '../../types';
import { CompanyHelperService } from './company-helper/company-helper.service';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(CompanyHelperService)
    private readonly companyHelperService: CompanyHelperService,
  ) {}

  async createCompany(data: CreateCompanyDto, user: User) {
    const createdCompany = await this.companyHelperService.assignDataToNew(
      data,
      user,
    );
    console.log(createdCompany);
    if (!(createdCompany instanceof Company)) return createdCompany;
    return createdCompany
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch((e) => {
        throw e;
      });
  }
}
