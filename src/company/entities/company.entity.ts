import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';

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
}
792497347;
