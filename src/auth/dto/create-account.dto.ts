import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The User first name',
    example: '',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The User last name',
    example: '',
  })
  @IsString()
  lastName: string;

  @IsString()
  @ApiProperty({
    description: 'The User email',
    example: '',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The User phone number',
    example: '',
  })
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'The Account Role',
    example: {
      name: ""
    }
  })
  role: Role
}
