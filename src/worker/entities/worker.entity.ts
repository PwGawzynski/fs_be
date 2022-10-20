import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
import { WorkDay } from '../../work-day/entities/work-day.entity';

@Entity()
export class Worker extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    nullable: false,
  })
  @JoinColumn()
  user: Promise<User>;

  @ManyToOne(() => Company, (company) => company.workers, {
    nullable: true,
  })
  @JoinColumn()
  isWorkerAtCompany: Promise<Company>;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => WorkDay, (workDay) => workDay.worker)
  workDays: WorkDay[];

  public async unique(byProperty) {
    return !(await Worker.findOne({
      where: {
        [byProperty]: await this[byProperty],
      },
    }));
  }
}
