import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Field } from './entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { User } from '../user/entities/user.entity';
import { UniversalResponseObject } from '../../types';
import { HttpService } from '@nestjs/axios';
import { TypeORMError } from 'typeorm';
import * as convert from 'xml-js';
@Injectable()
export class FieldService {
  constructor(private readonly httpService: HttpService) {}
  private async _getFiledArea(data: CreateFieldDto) {
    //TODO this ask can give us field id so use it on get plod id
    const fieldHa = (
      await this.httpService.axiosRef.get(
        `https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?SERVICE=WMS&request=GetFeatureInfo&version=1.3.0&layers=obreby,dzialki,geoportal&styles=&crs=EPSG:2180&bbox=${
          data.longitude + 0.01
        },${data.latitude + 0.01},${data.longitude + 0.02},${
          data.latitude + 0.02
        }&width=10&height=10&format=image/png&transparent=true&query_layers=geoportal&i=1&j=1&INFO_FORMAT=text/xml`,
      )
    ).data as unknown as string;
    const area = Number(
      convert
        .xml2js(fieldHa)
        .elements[0].elements[0].elements[0].elements.filter((elementObj) =>
          elementObj.attributes.Name.includes('(ha)'),
        )[0].elements[0].text as string,
    );
    return area;
  }

  private async _getPlodId(data: CreateFieldDto): Promise<string | false> {
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
      : false;
  }

  async createNewField(data: CreateFieldDto, user: User) {
    const field = new Field();
    field.area = await this._getFiledArea(data);
    const plodId = await this._getPlodId(data);
    if (!plodId)
      throw new HttpException(
        'Cannot find any plod using given latitude and longitude',
        HttpStatus.NOT_FOUND,
      );
    if (!(await field.unique('plodId')))
      throw new HttpException(
        'Given coords has already be signed to existing plot!',
        HttpStatus.CONFLICT,
      );
    field.plotId = plodId;
    field.longitude = data.longitude;
    field.latitude = data.latitude;
    field.name = data.name ?? null;
    field.owner = Promise.resolve(user);

    return field
      .save()
      .then(() => {
        return { status: true } as UniversalResponseObject;
      })
      .catch(() => {
        throw new TypeORMError('Cannot save');
      });
  }
}
