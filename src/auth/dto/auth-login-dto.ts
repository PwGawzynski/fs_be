import { IsString } from 'class-validator';

export class AuthLoginDto {
  @IsString({
    message: 'There is no any given login',
  })
  login: string;
  @IsString({
    message: 'There is no any given password',
  })
  password: string;
}
