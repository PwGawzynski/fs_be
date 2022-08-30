import { CreateUserDto } from '../../user/dto/create-user.dto';
import { PickType } from '@nestjs/mapped-types';

// This class is based on CreateUserDto 'case it uses the same fields and types as user entity but only two of em.
export class AuthLoginDto extends PickType(CreateUserDto, [
  'login',
  'password',
] as const) {}
