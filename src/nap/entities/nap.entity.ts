import {
  BaseEntity,
  Between,
  Column,
  Entity,
  IsNull,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkDay } from '../../work-day/entities/work-day.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

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
          startDate: Between(
            new Date(
              new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                0,
              ).setHours(0),
            ),
            new Date(
              new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                23,
                59,
                59,
                999,
              ),
            ),
          ),
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
}
