import { Injectable } from '@nestjs/common';
import { Worker } from '../../worker/entities/worker.entity';
import { GetWorkerDailyDto } from '../dto/get-worker-daily.dto';

export interface DailyStats {
  done: number;
  undone: number;
}

export enum Operation {
  Daily,
  All,
}

@Injectable()
export class StatisticHelperService {
  public async getDailyTaskStats(
    data: GetWorkerDailyDto,
    operationSwitch: Operation,
  ): Promise<DailyStats> {
    const worker = await Worker.findOne({
      where: {
        id: data.workerId,
      },
      relations: ['hasTasks'],
    });

    let done;
    let undone;
    switch (operationSwitch) {
      case Operation.All:
        done = worker.hasTasks.reduce(
          (previousValue, currentValue) =>
            currentValue.performanceDay?.toDateString() ===
              new Date().toDateString() && currentValue.isDone
              ? (previousValue += 1)
              : previousValue,
          0,
        );

        undone = worker.hasTasks.reduce(
          (previousValue, currentValue) =>
            currentValue.performanceDay?.toDateString() !==
              new Date().toDateString() && !currentValue.isDone
              ? (previousValue += 1)
              : previousValue,
          0,
        );
        break;
      case Operation.Daily:
        done = worker.hasTasks.reduce(
          (previousValue, currentValue) =>
            currentValue.isDone ? (previousValue += 1) : previousValue,
          0,
        );

        undone = worker.hasTasks.reduce(
          (previousValue, currentValue) =>
            !currentValue.isDone ? (previousValue += 1) : previousValue,
          0,
        );
    }

    return {
      done,
      undone,
    };
  }
}
