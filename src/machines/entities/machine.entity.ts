import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Machine extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 300,
    nullable: false,
  })
  name: string;

  @Column({
    length: 200,
    nullable: false,
  })
  brand: string;

  @Column({
    length: 300,
    nullable: false,
  })
  model: string;

  @Column({
    precision: 5,
    default: 0,
  })
  workedHours: number;

  @Column({
    length: 50,
    default: null,
  })
  registrationNumber: string;

  @ManyToOne(() => Company, (company) => company.machines, {
    nullable: false,
  })
  @JoinColumn()
  belongToCompany: Company;
}
