import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { User } from '../user/entities/user.entity';
import { Field } from './entities/field.entity';
import { v4 as uuid } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { NewFieldRes } from '../../types';

@Injectable()
export class FieldService {
  constructor(private readonly httpService: HttpService) {}

  private async _assignDataToNewField(
    data: CreateFieldDto,
    user: User,
  ): Promise<Field | undefined> {
    const field = new Field();
    field.id = uuid();
    field.latitude = data.latitude;
    field.longitude = data.longitude;
    field.name = data.name ? data.name : null;
    // in case of issues check returning value from below
    // returning data format is status\nIDField\n that's why i use split to split to array data and then check if response is ok
    const plotId = (
      (
        await this.httpService.axiosRef.get(
          `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${data.latitude},${data.longitude}&result=teryt`,
        )
      ).data as unknown as string
    ).split('\n') as [string, string];
    console.log(plotId);
    field.plotId =
      !isNaN(Number(plotId[0])) && Number(plotId[0]) !== -1
        ? plotId[1]
        : undefined;
    field.owner = user;
    return field.plotId ? field : undefined;
  }

  async create(data: CreateFieldDto, user: User) {
    const field = await this._assignDataToNewField(data, user);
    if (!field)
      return {
        status: false,
        message: 'given latitude or longitude is possibly incorrect!',
      } as NewFieldRes;
    field.save();
    return {
      status: true,
      data: { id: field.plotId },
    } as NewFieldRes;
  }
}
