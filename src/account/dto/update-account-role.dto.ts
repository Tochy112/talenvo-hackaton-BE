import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAccountRoleDTO {
  @ApiProperty({
    description: 'The User first name',
    example: '',
  })
  @IsString()
  name: string;
}
