import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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
  name: string;
}
