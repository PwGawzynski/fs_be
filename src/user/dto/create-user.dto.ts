import { IsInt, IsString, Length, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5, 320, {
    message: 'Login should have between 5 and 320 characters',
  })
  login: string;

  @IsString()
  password: string;

  @IsString()
  @Length(1, 255, {
    message: 'Name should have between 1 and 255 characters',
  })
  name: string;

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
  age: number;
}
