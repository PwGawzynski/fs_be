import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UniversalResponseObject } from '../../../types';

@Injectable()
export class UserDbValidatorService {
  public async findBy(
    key: string,
    value: string,
    ifNotMessage: string,
    relations?: string[],
  ): Promise<User | UniversalResponseObject> {
    const user = await User.findOne({
      where: {
        [key]: value,
      },
      relations,
    });
    if (!user)
      return {
        status: false,
        message: ifNotMessage,
      } as UniversalResponseObject;
    return user;
  }
}
