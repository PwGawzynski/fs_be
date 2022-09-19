import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Task {
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
}
