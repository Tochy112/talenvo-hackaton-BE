import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';
import { Account } from 'src/account/entities/account.entity';

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
    description: 'Course Subject',
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
    description: 'Course content',
    example: '',
  })
  @IsString()
  content: string[];

  @ApiProperty({
    description: 'Course difficultyLevel',
    example: '',
  })
  @IsString()
  difficultyLevel: string;

  @ApiProperty({
    description: 'Course class',
    example: '',
  })
  @IsString()
  class: string;

  @ApiProperty({
    description: 'User account',
    example: '',
  })
  @IsString()
  account: Account;
 
}
