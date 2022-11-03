import {
  BaseEntity,
  Column,
  Entity,
  IsNull,
  JoinColumn,
  ManyToOne,
  Not,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkDay } from '../../work-day/entities/work-day.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GetDatesBetweenForQuery } from '../../utils/beetwen-dates';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Nap extends BaseEntity {
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

  @ManyToOne(() => WorkDay, (workDay) => workDay.naps)
  @JoinColumn()
  workDay: Promise<WorkDay>;

  public static async checkIfAnyIsOpen(startDate: Date) {
    if (
      !!(await Nap.findOne({
        where: {
          startDate: GetDatesBetweenForQuery(startDate, startDate),
          endDate: IsNull(),
        },
      }))
    ) {
      throw new HttpException(
        'There is open nap for given date, close or delete it and try again',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  public static async findOpenForDateOrReject(startDate: Date, user: User) {
    const found = await Nap.findOne({
      where: {
        startDate: GetDatesBetweenForQuery(startDate, startDate),
        endDate: IsNull(),
        workDay: {
          worker: {
            user: {
              id: user.id,
            },
          },
        },
      },
    });
    if (!found) {
      throw new HttpException(
        'Cannot find any open nap',
        HttpStatus.BAD_REQUEST,
      );
    }
    return found;
  }

  public static async findAllOpenForPeriodAndUser(
    startDate: Date,
    endDate: Date,
    user: User,
  ) {
    console.log(GetDatesBetweenForQuery(startDate, endDate));
    const found = await Nap.find({
      where: {
        startDate: GetDatesBetweenForQuery(startDate, endDate),
        workDay: {
          worker: {
            user: {
              id: user.id,
            },
          },
        },
        endDate: Not(IsNull()),
      },
    });
    console.log(found);
    if (!found.length) {
      throw new HttpException(
        'Cannot find any open nap',
        HttpStatus.BAD_REQUEST,
      );
    }
    return found;
  }
}
