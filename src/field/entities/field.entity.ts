import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;
}
