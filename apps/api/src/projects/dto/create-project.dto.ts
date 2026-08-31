import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'New Website Launch' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Redesigning the corporate website.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'uuid-org-id' })
  @IsUUID()
  @IsNotEmpty()
  organization_id!: string;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  @IsUUID()
  @IsOptional()
  assignee_id?: string;
}
