import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Roles } from './roles.entity';
import { Company } from '../../company/entities/company.entity';

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

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Roles)
  @JoinColumn()
  roles: Roles;

  @ManyToMany(() => Company, (company) => company.owners)
  @JoinTable()
  ownedCompanies: Company;
}
