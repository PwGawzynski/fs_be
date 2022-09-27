import { Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Company } from '../../company/entities/company.entity';
import { CreateWorkerDto } from '../../worker/dto/create-worker.dto';
import { User } from '../../user/entities/user.entity';

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

  public async isOwner(
    data: CreateWorkerDto,
    user: User,
  ): Promise<Company | UniversalResponseObject> {
    const companyGivenToBeSigned = await Company.findOne({
      where: {
        id: data.companyID,
      },
      relations: ['owners'],
    });
    if (!companyGivenToBeSigned)
      return {
        status: false,
        message: `Company with given id doesn't exist`,
      } as UniversalResponseObject;

    if (
      !companyGivenToBeSigned.owners.filter((owner) => owner.id === user.id)
        .length
    )
      return {
        status: false,
        message: 'You are not owner of this company',
      } as UniversalResponseObject;
    return companyGivenToBeSigned;
  }
}
