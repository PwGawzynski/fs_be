import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkDay } from '../../work-day/entities/work-day.entity';

@Entity()
export class Nap {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => WorkDay, (workDay) => workDay.naps)
  @JoinColumn()
  workDay: Promise<WorkDay>;
}