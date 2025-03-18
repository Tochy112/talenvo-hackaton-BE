import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { Question } from 'src/question/entities/question.entity';

export class CreateQuizDto {
  @ApiProperty({
    description: 'The quiz title',
    example: '',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The quiz instruction',
    example: '',
  })
  @IsString()
  instruction: string;

  @IsString()
  @ApiProperty({
    description: 'The quiz pass mark',
    example: '',
  })
  @IsString()
  passingScore: number;

  @ApiProperty({
    description: 'The quiz max score',
    example: '',
  })
  @IsString()
  maxScore: number;

  @ApiProperty({
    description: 'The Xp reward',
    example: '',
  })
  @IsString()
  xpReward: number;

  @ApiProperty({
    description: 'The quiz questions',
    example: [{
      questionText: '',
      options: [],
      correctAnswer: '',
      points: '',
    }],
  })
  @IsArray()
  @IsOptional()
  questions: Question[];

  // @ApiProperty({
  //   description: 'The quiz questions',
  //   example: '',
  // })
  // @IsOptional()
  // course: Course;
}
