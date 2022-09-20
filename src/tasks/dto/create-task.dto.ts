import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Task name nus be a string type' })
  @MaxLength(300)
  @IsNotEmpty({ message: 'Task name cannot be empty' })
  name: string;

  @IsString({
    message: 'Task description must be a string type',
  })
  @MaxLength(1000)
  @IsOptional()
  description: string;

  @IsDate({ message: `Task's Performance day must be a string type` })
  @IsNotEmpty({ message: `Task's performance data myst be given` })
  performanceDay: Date;
}
