import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Rank {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({unique: true})
  name: string;

  @Column()
  minXp: number;

  @Column()
  maxXp: number;

  @Column({ nullable: true })
  badge: string;

  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;
}
