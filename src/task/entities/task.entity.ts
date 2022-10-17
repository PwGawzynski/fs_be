import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
import { Worker } from '../../worker/entities/worker.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 300,
    nullable: false,
  })
  name: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
  })
  @JoinColumn()
  purchaser: Promise<User>;

  @ManyToOne(() => Company, (company) => company.tasks, {
    // if task comes from company or from client it always should have company signed
    nullable: false,
  })
  @JoinColumn()
  company: Promise<Company>;

  @ManyToMany(() => Worker, {
    nullable: true,
  })
  @JoinTable()
  workers: Promise<Worker[]>;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Date;

  @Column({
    default: null,
  })
  endTIme: Date;

  @Column({
    default: false,
  })
  isDone: boolean;

  @Column({
    nullable: true,
  })
  performanceDay: Date;

  @Column({
    default: null,
    nullable: true,
    comment: 'Measured time taken to complete task in ms',
  })
  durationTime: number;
}
