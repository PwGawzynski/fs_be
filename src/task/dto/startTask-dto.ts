import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Task } from '../entities/task.entity';

export class StartTaskDto {
  @IsUUID()
  @IsNotEmpty({
    message: 'Task ID must be defined',
  })
  @FindOrReject(Task, {
    message: 'Cannot find task with given Id',
  })
  taskId: string;

  @IsOptional()
  @IsDate({
    message: 'If start time is given, it cannot be empty',
  })
  startDate: Date;
}
