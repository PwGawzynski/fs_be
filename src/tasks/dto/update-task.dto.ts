import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class UpdateTaskAddWorkersDto {
  @IsNotEmpty({
    message: 'Cannot sign 0 workers to task',
  })
  @IsUUID(4, { each: true })
  workersIDS: string[];

  @IsNotEmpty({
    message: 'Task id number cannot be empty',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'id must have 36 characters',
  })
  TaskId: string;
}
