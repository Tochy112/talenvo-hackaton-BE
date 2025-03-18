import { Account } from 'src/account/entities/account.entity';
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
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Account, user => user.quizAttempts)
  user: Account;

  @ManyToOne(() => Quiz, quiz => quiz.attempts)
  quiz: Quiz;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  passed: boolean;

  @Column({ type: 'json', nullable: true })
  answers: Record<string, string>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  attemptedAt: Date;
}