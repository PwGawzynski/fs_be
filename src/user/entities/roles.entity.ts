import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  IsOwner: boolean;

  @Column({
    default: false,
  })
  IsWorker: boolean;
}
