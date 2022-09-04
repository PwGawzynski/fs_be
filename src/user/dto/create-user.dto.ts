import {
  IsInt,
  IsString,
  Length,
  Min,
  Max,
  IsEmail,
  IsAscii,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ICreateUserAsk } from '../../../types';

export class CreateUserDto implements ICreateUserAsk {
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  @Length(5, 320, {
    message: 'Login should have between 5 and 320 characters',
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @Matches(/[a-zA-Z]/)
  @IsString()
  @Length(1, 255, {
    message: 'Name should have between 1 and 255 characters',
  })
  name: string;

  @IsNotEmpty()
  @Matches(/[a-zA-Z]/)
  @IsString()
  @Length(1, 255, {
    message: 'Surname should have between 1 and 255 characters',
  })
  surname: string;

  @IsInt()
  @Min(1, {
    message: 'You should grow up a little to start use this app',
  })
  @Max(999, {
    message: `Don't you to old to be a farmer ?`,
  })
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  @IsEmail({
    message: 'Given email is incorrect !!',
  })
  email: string;
}
