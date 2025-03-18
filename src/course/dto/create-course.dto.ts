import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuizQuestionDto } from 'src/question/dto/quiz-question.dto';


class QuizDto {
  @ApiProperty({
    description: 'Title of the quiz',
    example: '',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Quiz instructions',
    example: '',
  })
  @IsString()
  instruction: string;

  @ApiProperty({
    description: 'Passing score for the quiz',
    example: "",
  })
  @IsString()
  passingScore: number;

  @ApiProperty({
    description: 'Maximum possible score',
    example: 0,
  })
  @IsString()
  maxScore: number;

  @ApiProperty({
    description: 'XP reward for completing the quiz',
    example: 0,
  })
  @IsString()
  xpReward: number;

  @ApiProperty({
    description: 'Quiz questions',
    type: [QuizQuestionDto],
  })
  @IsArray()
  questions: QuizQuestionDto[];
}


export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: '',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: '',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Course category',
    example: '',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Course subject',
    example: '',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Course outline',
    example: '',
  })
  @IsString()
  outline: string;

  @ApiProperty({
    description: 'Course content pages',
    example: [{ page1: '' }],
  })
  @IsArray()
  content: [];

  @ApiProperty({
    description: 'Course difficulty level',
    example: '',
  })
  @IsString()
  difficultyLevel: string;

  @ApiProperty({
    description: 'Class for which this course is intended',
    example: '',
  })
  @IsString()
  class: string;

  @ApiProperty({
    description: 'Associated quizzes for this course',
    type: [QuizDto],
  })
  @IsArray()
  @IsOptional()
  quizzes?: QuizDto[];
}
