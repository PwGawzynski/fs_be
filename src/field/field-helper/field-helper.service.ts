import { Inject, Injectable } from '@nestjs/common';
import { UniversalResponseObject } from '../../../types';
import { Field } from '../entities/field.entity';
import { CreateFieldDto } from '../dto/create-field.dto';
import { User } from '../../user/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { FieldDbValidatorService } from '../../db-validators/field-db-validator/field-db-validator.service';

@Injectable()
export class FieldHelperService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(FieldDbValidatorService)
    private readonly fieldDbValidatorService: FieldDbValidatorService,
  ) {}

  // TODO implement api call to get area
  private _getFieldArea(fieldID: string) {
    return 2.31;
  }

  private async _getPlodId(
    data: CreateFieldDto,
  ): Promise<string | UniversalResponseObject> {
    // in case of issues check returning value from below
    // returning data format is status\nIDField\n that's why i use split to split to array data and then check if response is ok
    const plotId = (
      (
        await this.httpService.axiosRef.get(
          `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${data.latitude},${data.longitude}&result=teryt`,
        )
      ).data as unknown as string
    ).split('\n') as [string, string];
    return !isNaN(Number(plotId[0])) && Number(plotId[0]) !== -1
      ? plotId[1]
      : ({
          status: false,
          message:
            'Cannot find plodId, try again later or check latitude and longitude',
        } as UniversalResponseObject);
  }

  public async assignDataToNewField(
    data: CreateFieldDto,
    user: User,
  ): Promise<Field | UniversalResponseObject> {
    const field = new Field();
    field.id = uuid();
    field.latitude = data.latitude;
    field.longitude = data.longitude;
    field.name = data.name ? data.name : null;

    const plodID = await this._getPlodId(data);
    if (!(typeof plodID === 'string')) return plodID;

    const uniquePlodId = await this.fieldDbValidatorService.isUniqueEntity(
      'plotId',
      plodID,
    );
    if (!(typeof uniquePlodId === 'boolean')) return uniquePlodId;
    field.plotId = plodID;
    field.owner = user;
    field.area = this._getFieldArea('plotId');
    // after implementation area validation like plodID
    return field;
  }
}
