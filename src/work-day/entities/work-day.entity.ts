import {
  BaseEntity,
  Between,
  Column,
  Entity,
  JoinColumn,
  LessThan,
  ManyToOne,
  MoreThan,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../worker/entities/worker.entity';
import { Company } from '../../company/entities/company.entity';
import { Nap } from '../../nap/entities/nap.entity';

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

  public async checkIfAlreadyBeenCreated() {
    const today = new Date();
    return !!(await WorkDay.findOne({
      where: {
        startDate: Between(
          new Date(
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
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
