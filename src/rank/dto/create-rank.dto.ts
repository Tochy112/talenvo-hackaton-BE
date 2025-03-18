
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, } from 'class-validator';
import { Account } from 'src/account/entities/account.entity';

export class CreateRankDto {
  @ApiProperty({
    description: 'Rank name',
    example: '',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Rank min xp',
    example: '',
  })
  @IsString()
  minXp: number;

  @ApiProperty({
    description: 'Rank max xp',
    example: '',
  })
  @IsString()
  maxXp: number;

  @ApiProperty({
    description: 'Rank badge',
    example: '',
  })
  @IsString()
  badge: string;



 
 
}
