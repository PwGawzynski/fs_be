import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Worker } from '../worker/entities/worker.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class WorkerIdToEntity
  implements PipeTransform<string, Promise<Worker>>
{
  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<Worker | undefined> {
    if (typeof value !== 'string') return undefined;
    if (!isUUID(value))
      throw new HttpException(
        'WorkerId must be UUID string',
        HttpStatus.BAD_REQUEST,
      );
    const foundWorker = await Worker.findOne({
      where: {
        id: value,
      },
    });
    if (!foundWorker)
      throw new HttpException(
        'Cannot find worker with given id',
        HttpStatus.NOT_FOUND,
      );
    return foundWorker;
  }
}
