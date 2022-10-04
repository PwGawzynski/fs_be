import { Injectable } from '@nestjs/common';
import { Worker } from '../../worker/entities/worker.entity';
import { GetWorkerDailyDto } from '../dto/get-worker-daily.dto';

export interface DailyStats {
  done: number;
  undone: number;
}

@Injectable()
export class StatisticHelperService {
  public async getDailyTaskStats(data: GetWorkerDailyDto): Promise<DailyStats> {
    const done = (
      await Worker.findOne({
        where: {
          id: data.workerId,
        },
        relations: ['hasTasks'],
      })
    ).hasTasks.reduce(
      (previousValue, currentValue) =>
        currentValue.performanceDay?.toDateString() ===
        new Date().toDateString()
          ? (previousValue += 1)
          : previousValue,
      0,
    );

    const undone = (
      await Worker.findOne({
        where: {
          id: data.workerId,
        },
        relations: ['hasTasks'],
      })
    ).hasTasks.reduce(
      (previousValue, currentValue) =>
        currentValue.performanceDay?.toDateString() !==
        new Date().toDateString()
          ? (previousValue += 1)
          : previousValue,
      0,
    );
    return {
      done,
      undone,
    };
  }
}
