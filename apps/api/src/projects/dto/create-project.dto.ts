import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'New Website Launch' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Redesigning the corporate website.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiProperty({ example: 'uuid-org-id' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
