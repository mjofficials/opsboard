import { PartialType } from '@nestjs/swagger';
import { CreateTicketCommentDto } from './create-ticket-comment.dto.js';

export class UpdateTicketCommentDto extends PartialType(CreateTicketCommentDto) {}
