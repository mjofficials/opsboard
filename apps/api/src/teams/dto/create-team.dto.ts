import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateTeamDto {
  @ApiProperty({ example: 'member@example.com', description: 'The email of the member to invite' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ enum: Role, default: Role.MEMBER, description: 'The role of the member' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
