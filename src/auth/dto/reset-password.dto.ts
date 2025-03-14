import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'The user new password',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
