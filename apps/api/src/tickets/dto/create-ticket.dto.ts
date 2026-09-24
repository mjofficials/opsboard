import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Fix login page layout', description: 'The title of the ticket' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'The login button is misaligned on mobile screens', description: 'Detailed description of the ticket' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ enum: TicketStatus, default: TicketStatus.OPEN })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority, default: TicketPriority.MEDIUM })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({ description: 'The UUID of the project this ticket belongs to' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiPropertyOptional({ description: 'The UUID of the user assigned to this ticket' })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
