import {
  BaseEntity,
  Column,
  Entity,
  IsNull,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../worker/entities/worker.entity';
import { Company } from '../../company/entities/company.entity';
import { Nap } from '../../nap/entities/nap.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GetDatesBetweenForQuery } from '../../utils/beetwen-dates';

export enum CheckDateOption {
  ForPreviousDay,
  ForGivenDay,
}
export enum FindMethodOption {
  ForNullEndDate,
  ForEnyEndDate,
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

  public async findForAndFill(
    forPeriod: CheckDateOption,
    onFailMessage: string,
    forEndDateType: FindMethodOption,
  ) {
    let found;
    switch (forEndDateType) {
      case FindMethodOption.ForNullEndDate:
        found = await WorkDay.findOne({
          where: {
            startDate: GetDatesBetweenForQuery(
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
            ),

            worker: {
              id: (await this.worker).id,
            },
            doneForCompany: {
              id: (await this.doneForCompany).id,
            },
            endDate: IsNull(),
          },
        });
        break;
      case FindMethodOption.ForEnyEndDate:
        found = await WorkDay.findOne({
          where: {
            startDate: GetDatesBetweenForQuery(
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
            ),

            worker: {
              id: (await this.worker).id,
            },
            doneForCompany: {
              id: (await this.doneForCompany).id,
            },
          },
        });
        break;
    }
    console.log(found);
    if (!found) throw new HttpException(onFailMessage, HttpStatus.NO_CONTENT);
    this.startDate = found.startDate;
    this.endDate = found.endDate;
    this.id = found.id;
    this.worker = found.worker;
    this.naps = found.naps;
    this.doneForCompany = found.doneForCompany;
    return found;
  }

  public async checkIfAlreadyBeenCreated(
    forPeriod: CheckDateOption,
    forEndDateType: FindMethodOption,
  ) {
    let found;
    switch (forEndDateType) {
      case FindMethodOption.ForNullEndDate:
        found = !!(await WorkDay.findOne({
          where: {
            startDate: GetDatesBetweenForQuery(
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
            ),

            worker: {
              id: (await this.worker).id,
            },
            doneForCompany: {
              id: (await this.doneForCompany).id,
            },
            endDate: IsNull(),
          },
        }));
        break;
      case FindMethodOption.ForEnyEndDate:
        found = !!(await WorkDay.findOne({
          where: {
            startDate: GetDatesBetweenForQuery(
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
              forPeriod === CheckDateOption.ForPreviousDay
                ? new Date()
                : this.startDate,
            ),

            worker: {
              id: (await this.worker).id,
            },
            doneForCompany: {
              id: (await this.doneForCompany).id,
            },
          },
        }));
        break;
    }
    if (found)
      throw new HttpException(
        'You have already open work day for today',
        HttpStatus.CONFLICT,
      );
    return false;
  }
}
