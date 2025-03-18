import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
import { Role } from 'src/role/entities/role.entity';
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

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ nullable: true })
  rank: string;

  @ManyToOne(() => Role)
  @JoinColumn()
  role!: Role;

  @OneToMany(() => QuizAttempt, quizAttempt => quizAttempt.user)
  quizAttempts: QuizAttempt[];

  @Column({ nullable: true, select: false })
  resetToken: string;

  @Column({ nullable: true, select: false })
  resetTokenExpiry: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

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

  // @Column({ nullable: true, select: false })
  // verificationToken: string;

  // @Column({ default: false })
  // isVerified: boolean;
}
