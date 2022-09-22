import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateFieldDto {
  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 7,
  })
  latitude: number;
  @IsNotEmpty()
  @IsNumber({
    maxDecimalPlaces: 7,
  })
  longitude: number;

  @IsOptional()
  @Length(1, 300, {
    message:
      'Name must be at least one character  and max 300 characters length',
  })
  name: string;
}
