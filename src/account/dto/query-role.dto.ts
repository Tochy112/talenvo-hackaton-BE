import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class QueryRoleDto {
  @ApiProperty({
    description: 'The new role of the user',
    example: 'admin',
  })
  @IsNotEmpty()
  roleName: "admin"
}
