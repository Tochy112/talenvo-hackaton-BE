import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryUpload.module';
import { Account } from 'src/account/entities/account.entity';
import { Role } from 'src/role/entities/role.entity';
import { Rank } from 'src/rank/entities/rank.entity';
import { Quiz } from './entities/quiz.entity';
import { Question } from 'src/question/entities/question.entity';
import { QuizAttempt } from 'src/quiz-attempt/entities/quizAttempt.entity';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Role,
      Rank,
      Quiz,
      Question,
      QuizAttempt,
    ]),
    CloudinaryModule,
  ],
  controllers: [QuizController],
  providers: [QuizService, AccountService],
})
export class QuizModule {}
