import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { DoExistForWorker } from '../../db-validators/db-validation-decorators/worker/DoExistForWorker';

export class GetWorkerDailyDto {
  @IsUUID()
  @DoExistForWorker()
  @IsNotEmpty({
    message: 'ID cannot be empty string',
  })
  @Length(36, 36, {
    message: 'ID must be 36 character string',
  })
  workerId: string;
}
