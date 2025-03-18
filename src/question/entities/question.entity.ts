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
export class Question {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  questionText: string;

  @Column('json')
  options: string[];

  @Column()
  correctAnswer: string;

  @Column({ default: 1 })
  points: number;

  @ManyToOne(() => Quiz, quiz => quiz.questions)
  quiz: Quiz;
}
