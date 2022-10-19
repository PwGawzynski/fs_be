import {
  BaseEntity,
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

@Entity()
export class WorkDay extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => Worker, (worker) => worker.workDays)
  workerId: Worker;

  @ManyToOne(() => Company, (company) => company.workDays)
  @JoinColumn()
  doneForCompany: Company;

  @OneToMany(() => Nap, (nap) => nap.workDay)
  naps: Nap[];
}
