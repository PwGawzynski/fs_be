import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Roles } from './roles.entity';
import { Company } from '../../company/entities/company.entity';
import { Task } from '../../task/entities/task.entity';
import { Field } from '../../field/entities/field.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  name: string;

  @Column({
    length: 255,
  })
  surname: string;

  @Column({
    precision: 3,
  })
  age: number;

  @OneToOne(() => Account, {
    eager: true,
  })
  @JoinColumn()
  account: Account;

  @OneToOne(() => Roles, {
    eager: true,
  })
  @JoinColumn()
  roles: Roles;

  @ManyToMany(() => Company, (company) => company.owners)
  ownedCompanies: Promise<Company[]>;

  @OneToMany(() => Task, (task) => task.purchaser)
  @JoinColumn()
  tasks: Promise<Task[]>;

  @OneToMany(() => Field, (field) => field.owner)
  @JoinColumn()
  ownedFields: Promise<Field[]>;
}
