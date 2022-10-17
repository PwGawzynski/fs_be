import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Worker extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    nullable: false,
  })
  @JoinColumn()
  user: Promise<User>;

  @ManyToOne(() => Company, (company) => company.workers, {
    nullable: true,
  })
  @JoinColumn()
  isWorkerAtCompany: Promise<Company>;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  public async unique(byProperty) {
    console.log(
      await Worker.findOne({
        where: {
          user: this[byProperty],
        },
      }),
      await this.user,
    );

    return !(await Worker.findOne({
      where: {
        [byProperty]: await this[byProperty],
      },
    }));
  }
}
