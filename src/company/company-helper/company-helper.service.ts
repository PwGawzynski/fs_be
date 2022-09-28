import { Inject, Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { User } from '../../user/entities/user.entity';
import { CompanyDbValidatorService } from '../../db-validators/company-db-validator/company-db-validator.service';

@Injectable()
export class CompanyHelperService {
  constructor(
    @Inject(CompanyDbValidatorService)
    private readonly companyDbValidatorService: CompanyDbValidatorService,
  ) {}

  public async assignDataToNew(
    data: CreateCompanyDto,
    user: User,
  ): Promise<Company | UniversalResponseObject> {
    const company = new Company();

    // check if given company name is unique
    const validationNameResult =
      await this.companyDbValidatorService.isGivenPropUniq('name', data.name);
    if (!(typeof validationNameResult === 'boolean'))
      return validationNameResult;

    company.name = data.name;
    company.description = data.description ? data.description : null;
    company.machines = null;
    company.owners = [user];
    company.tasks = null;
    return company;
  }
}
