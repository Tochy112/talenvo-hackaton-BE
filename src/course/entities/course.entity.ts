import { Account } from 'src/account/entities/account.entity';
import { Question } from 'src/question/entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
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

  @Column({ nullable: false, type: "json"})
  content: object[];

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

  @OneToMany(() => Quiz, (quiz) => quiz.course, {cascade: ['remove'] })
  quizzes: Quiz[];
}
