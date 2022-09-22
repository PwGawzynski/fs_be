import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Worker } from '../../worker/entities/worker.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 500,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2000,
  })
  description: string;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Machine, (machine) => machine.belongToCompany)
  @JoinColumn()
  machines: Machine[];

  @ManyToMany(() => User, (user) => user.ownedCompanies)
  @JoinTable()
  owners: User[];

  @OneToMany(() => Task, (task) => task.purchaser)
  @JoinColumn()
  tasks: Task[];

  @OneToMany(() => Worker, (worker) => worker.isWorkerAtCompany)
  @JoinColumn()
  workers: Worker[];
}
