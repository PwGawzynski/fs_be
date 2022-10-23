import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Nap } from '../entities/nap.entity';

export class CloseNapDto {
  @IsOptional()
  @IsNotEmpty({
    message: 'Nap Id must not be empty if it is given',
  })
  @FindOrReject(Nap, {
    message: 'Given Nap Id cannot be connect with any existing workDay',
  })
  napId?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'End date must not be empty if it is given',
  })
  @IsDate({
    message: 'End date param must be date type',
  })
  endDate?: Date;
}
