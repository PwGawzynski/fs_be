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
  purchaser: User;

  @ManyToOne(() => Company, (company) => company.tasks, {
    nullable: true,
  })
  @JoinColumn()
  company: Company;

  @ManyToMany(() => User)
  @JoinTable()
  workers: User[];

  @Column({
    nullable: false,
  })
  startTime: Date;

  @Column({
    nullable: false,
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
}
