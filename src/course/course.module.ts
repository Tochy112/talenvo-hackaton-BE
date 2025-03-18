import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountController } from 'src/account/account.controller';
import { Role } from 'src/role/entities/role.entity';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryUpload.module';
import { Rank } from 'src/rank/entities/rank.entity';
import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Question } from 'src/question/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Account,
      Role,
      Rank,
      QuizAttempt,
      Quiz,
      Question,
    ]),
    CloudinaryModule,
  ],
  controllers: [CourseController, AccountController],
  providers: [CourseService, AuthService, AccountService, JwtService],
  exports: [CourseService],
})
export class CourseModule {}
