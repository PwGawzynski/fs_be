import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { FindOrReject } from '../../ClassValidatorCustomDecorators/FindOrReject.decorator';
import { Task } from '../entities/task.entity';
import { Worker } from '../../worker/entities/worker.entity';

export class AssignWorkersDto {
  @IsNotEmpty({
    message: 'Cannot sign 0 workers to task',
  })
  @IsUUID(4, { each: true })
  @FindOrReject(Worker, {
    each: true,
    message: 'One of given worker ids cannot be found',
  })
  workersIDS: string[];

  @IsNotEmpty({
    message: 'Task id number cannot be empty',
  })
  @IsUUID()
  @Length(36, 36, {
    message: 'id must have 36 characters',
  })
  @FindOrReject(Task, {
    message: 'Cannot find task with given Id',
  })
  TaskId: string;
}
