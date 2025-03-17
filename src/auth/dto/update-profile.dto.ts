import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class UpdateProfileDto {
  @ApiProperty({
    description: 'The User first name',
    example: '',
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The User last name',
    example: '',
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The user phone number',
    example: '',
  })
  @IsOptional()
  @IsString()
  phoneNumber: string;
}
