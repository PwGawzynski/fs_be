import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 320,
  })
  login: string;

  @Column()
  pwdHashed: string;

  @Column({
    default: null,
  })
  //TODO change to array
  currentTokenId: string | null;

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

  @Column({
    length: 320,
  })
  email: string;

  @Column({
    default: null,
    length: 36,
  })
  activateHash: string;

  @Column({
    default: false,
  })
  activated: boolean;
}
