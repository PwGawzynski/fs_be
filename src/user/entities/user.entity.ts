import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

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
}
