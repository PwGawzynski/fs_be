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
import { Machine } from '../../machine/entities/machine.entity';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../task/entities/task.entity';
import { Worker } from '../../worker/entities/worker.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 500,
    nullable: false,
    unique: true,
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
  machines: Promise<Machine[]>;

  @ManyToMany(() => User, (user) => user.ownedCompanies)
  @JoinTable()
  owners: Promise<User[]>;

  @OneToMany(() => Task, (task) => task.purchaser)
  @JoinColumn()
  tasks: Promise<Task[]>;

  @OneToMany(() => Worker, (worker) => worker.isWorkerAtCompany)
  @JoinColumn()
  workers: Promise<Worker[]>;

  public async checkUnique(byProperty: string) {
    return !!(await Company.findOne({
      where: {
        [byProperty]: this[byProperty],
      },
    }));
  }
  public static async exist(byProperty: string) {
    const found = await Company.findOne({
      where: {
        [byProperty]: this[byProperty],
      },
    });
    if (!found) return false;
    return found;
  }
}
