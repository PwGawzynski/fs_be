import { UserRolesObj } from '../../../types';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateRolesDto implements UserRolesObj {
  @IsOptional()
  @IsBoolean({
    message: 'Registered user role must be boolean',
  })
  worker: boolean;
  @IsOptional()
  @IsBoolean({
    message: 'Registered user role must be boolean',
  })
  owner: boolean;
}
