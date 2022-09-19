import {
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

@Entity()
export class Company {
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

  @OneToMany(() => Machine, (machine) => machine.belongToCompany)
  @JoinColumn()
  machines: Machine[];

  @ManyToMany(() => User, (user) => user.ownedCompanies)
  @JoinTable()
  owners: User[];
}
