import { Account } from 'src/account/entities/account.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  subject: string;

  @Column('text', { nullable: false })
  outline: string;

  @Column({ nullable: false, type: "simple-array"})
  content: string[];

  @Column({ nullable: false })
  difficultyLevel: string;

  @Column({ nullable: false })
  class: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account!: Account;

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

//   @OneToMany(() => Quiz, (quiz) => quiz.course)
//   quizzes: Quiz[];

//   @OneToMany(() => CourseProgress, (progress) => progress.course)
//   courseProgress: CourseProgress[];
}
