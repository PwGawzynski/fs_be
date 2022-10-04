import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Worker extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Company, (company) => company.workers, {
    nullable: true,
  })
  @JoinColumn()
  isWorkerAtCompany: Company;

  @ManyToMany(() => Task, (task) => task.workers, {
    nullable: true,
  })
  hasTasks: Task[];

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
