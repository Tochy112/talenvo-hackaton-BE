import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';


export class QuizQuestionDto {
  @ApiProperty({
    description: 'Quiz question',
    example: "",
  })
  @IsString()
  questionText: string;

  @ApiProperty({
    description: 'Array of options',
    example: [],
  })
  @IsArray()
  options: string[];

  @ApiProperty({
    description: 'Correct answer',
    example: '',
  })
  @IsString()
  correctAnswer: string;

  @ApiProperty({
    description: 'Points for the question',
    example: 0,
  })
  @IsString()
  points: number;
}