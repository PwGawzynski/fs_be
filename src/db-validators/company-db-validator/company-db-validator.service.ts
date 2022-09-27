import { Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Company } from '../../company/entities/company.entity';

@Injectable()
export class CompanyDbValidatorService {
  // maybe it is unnecessary because DB should throw error if is not unique
  public async isGivenPropUniq(
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

  public async findWOwners(
    id: string,
  ): Promise<Company | UniversalResponseObject> {
    const company = await Company.findOne({
      where: {
        id,
      },
      relations: ['owners'],
    });
    if (!company)
      return {
        status: false,
        message: 'Cannot find given company',
      } as UniversalResponseObject;
    return company;
  }
}
