import { Inject, Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { User } from '../user/entities/user.entity';
import { Field } from './entities/field.entity';
import { NewFieldRes } from '../../types';
import { FieldHelperService } from './field-helper/field-helper.service';

@Injectable()
export class FieldService {
  constructor(
    @Inject(FieldHelperService)
    private readonly fieldHelperService: FieldHelperService,
  ) {}

  async create(data: CreateFieldDto, user: User) {
    const field = await this.fieldHelperService.assignDataToNewField(
      data,
      user,
    );
    if (!(field instanceof Field)) return field;

    return field
      .save()
      .then(() => {
        return {
          status: true,
          data: { id: field.plotId },
        } as NewFieldRes;
      })
      .catch((e) => {
        throw e;
      });
  }
}
