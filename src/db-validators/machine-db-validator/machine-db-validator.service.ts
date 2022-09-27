import { Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Machine } from '../../machines/entities/machine.entity';

@Injectable()
export class MachineDbValidatorService {
  public async isUniqBy(
    field: string,
    value: string,
  ): Promise<boolean | UniversalResponseObject> {
    return (
      await Machine.find({
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
