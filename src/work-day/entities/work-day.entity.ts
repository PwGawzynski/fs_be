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
import { HttpException, HttpStatus } from '@nestjs/common';

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

  public async findForAndFill(forPeriod: CheckDateOption) {
    let date;
    let endDate;
    switch (forPeriod) {
      case CheckDateOption.ForPreviousDay:
        date = new Date();
        endDate = new Date();
        break;
      case CheckDateOption.ForGivenDay:
        date = this.startDate;
        endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
    }

    const found = await WorkDay.findOne({
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
          endDate,
        ),

        worker: {
          id: (await this.worker).id,
        },
        doneForCompany: {
          id: (await this.doneForCompany).id,
        },
      },
    });
    if (!found)
      throw new HttpException(
        'Cannot find any open work with can be connect with new nap',
        HttpStatus.BAD_REQUEST,
      );
    this.startDate = found.startDate;
    this.endDate = found.endDate;
    this.id = found.id;
    this.worker = found.worker;
    this.naps = found.naps;
    this.doneForCompany = found.doneForCompany;
    return found;
  }

  public async checkIfAlreadyBeenCreated(forPeriod: CheckDateOption) {
    let date;
    let endDate;
    switch (forPeriod) {
      case CheckDateOption.ForPreviousDay:
        date = new Date();
        endDate = new Date();
        break;
      case CheckDateOption.ForGivenDay:
        date = this.startDate;
        endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
    }

    const found = !!(await WorkDay.findOne({
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
          endDate,
        ),

        worker: {
          id: (await this.worker).id,
        },
        doneForCompany: {
          id: (await this.doneForCompany).id,
        },
      },
    }));
    if (found)
      throw new HttpException(
        'You have already open work day for today',
        HttpStatus.CONFLICT,
      );
    return false;
  }
}
