import { Course } from 'src/course/entities/course.entity';
import { Question } from 'src/question/entities/question.entity';
import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
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
export class Quiz {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  instruction: string;

  @Column({ default: 0, nullable: false })
  passingScore: number;

  @Column({ default: 0, nullable: false })
  maxScore: number;

  @Column({ default: 0, nullable: false })
  xpReward: number;

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

  @OneToMany(() => Question, (question) => question.quiz, { cascade:  ['remove'] })
  questions: Question[];

  @ManyToOne(() => Course, (course) => course.quizzes)
  course: Course;

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz, {cascade:  ['remove']})
  attempts: QuizAttempt[];
}
