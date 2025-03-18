import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
import { AccountService } from 'src/account/account.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    private userService: AccountService,
  ) {}

  // Create a new quiz
  async createQuiz(
    courseId: string,
    createQuizDto: CreateQuizDto,
  ): Promise<Quiz> {    

    console.log("courseId:", courseId);
    
    const existingQuiz = await this.quizRepository.findOne({
      where: { course: { id: courseId } },
    });    

    if (existingQuiz) {
      throw new BadRequestException('Quiz already exists');
    }

    // Then create the quiz
    const quiz = this.quizRepository.create({
      ...createQuizDto,
      course: { id: courseId },
    });

    const savedQuiz = await this.quizRepository.save(quiz);

    return savedQuiz;
  }

  // update quiz
  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['course'],
    });
  
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    Object.assign(quiz, updateQuizDto);
  
    return await this.quizRepository.save(quiz);
  }
  

  // Get quiz by ID
  async getQuiz(quizId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });    
  
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    return quiz;
  }
  

  // Submit a quiz attempt
  async submitQuizAttempt(
    userId: string,
    quizId: string,
    submissionDto: SubmitQuizDto,
  ): Promise<QuizAttempt> {
    const { answers } = submissionDto;

    const user = await this.accountRepository.findOne({
      where: { id: userId }
    });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const quiz = await this.quizRepository.findOne({
      where: {id: quizId},
      relations: ['questions', 'course', 'attempts'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    let score = 0;
    const questions = quiz.questions;

    for (const question of questions) {
      console.log("question.correctAnswer:", question.correctAnswer);
      console.log("answers[question.id]", answers[question.id]);
      
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    }

    const passed = score >= quiz.passingScore;
    console.log("passed:", passed);
    
    const attempt = this.attemptRepository.create({
      user: { id: userId },
      quiz: { id: quizId },
      score,
      passed,
      answers,
    });

    await this.attemptRepository.save(attempt);

    // Award XP if the quiz is passed
    if (passed) {
      await this.userService.updateXp(userId, quiz.xpReward);
    }

    return attempt;
  }
}
