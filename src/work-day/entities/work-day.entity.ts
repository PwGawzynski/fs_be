import {
  BaseEntity,
  Between,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../worker/entities/worker.entity';
import { Company } from '../../company/entities/company.entity';
import { Nap } from '../../nap/entities/nap.entity';

export enum CheckDateOption {
  ForPreviousDay,
  ForGivenDay,
}

@Entity()
export class WorkDay extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    nullable: true,
  })
  endDate: Date;

  @ManyToOne(() => Worker, (worker) => worker.workDays)
  @JoinColumn()
  worker: Promise<Worker>;

  @ManyToOne(() => Company, (company) => company.workDays)
  @JoinColumn()
  doneForCompany: Promise<Company>;

  @OneToMany(() => Nap, (nap) => nap.workDay)
  naps: Promise<Nap[]>;

  public async checkIfAlreadyBeenCreated(forPeriod: CheckDateOption) {
    let date;

    switch (forPeriod) {
      case CheckDateOption.ForPreviousDay:
        date = new Date();
        break;
      case CheckDateOption.ForGivenDay:
        date = this.startDate;
        break;
    }

    return !!(await WorkDay.findOne({
      where: {
        startDate: Between(
          new Date(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
            ).setHours(0),
          ),
          new Date(),
        ),

        worker: {
          id: (await this.worker).id,
        },
        doneForCompany: {
          id: (await this.doneForCompany).id,
        },
      },
    }));
  }
}
