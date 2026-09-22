import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTicketCommentDto {
  @ApiProperty({ description: 'The UUID of the ticket' })
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
