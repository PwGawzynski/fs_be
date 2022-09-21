import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Field extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    length: 300,
  })
  name: string;

  @Column({
    nullable: false,
    length: 40,
  })
  plotId: string;

  @Column({
    nullable: false,
  })
  latitude: number;

  @Column({
    nullable: false,
  })
  longitude: number;

  @Column({
    type: 'float',
    precision: 5,
    scale: 4,
  })
  area: number;

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;
}
