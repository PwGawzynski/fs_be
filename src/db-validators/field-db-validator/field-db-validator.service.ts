import { Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Field } from '../../field/entities/field.entity';

@Injectable()
export class FieldDbValidatorService {
  public async isUniqueEntity(
    field: string,
    value: string,
  ): Promise<boolean | UniversalResponseObject> {
    return (
      await Field.find({
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
}
