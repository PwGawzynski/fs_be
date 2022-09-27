import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UniversalResponseObject } from '../../../types';

@Injectable()
export class UserDbValidatorService {
  public async existInDb(
    id: string,
    ifNotMessage: string,
  ): Promise<User | UniversalResponseObject> {
    const purchaser = await User.findOne({
      where: {
        id,
      },
    });
    if (!purchaser)
      return {
        status: false,
        message: ifNotMessage,
      } as UniversalResponseObject;
    return purchaser;
  }
}
