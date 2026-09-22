import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto.js';
import { UpdateTicketCommentDto } from './dto/update-ticket-comment.dto.js';

@Injectable()
export class TicketCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketCommentDto: CreateTicketCommentDto, userId: string) {
    return this.prisma.ticketComment.create({
      data: {
        comment: createTicketCommentDto.comment,
        ticketId: createTicketCommentDto.ticketId,
        userId: userId,
      }
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.ticketComment.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!comment) throw new NotFoundException();
    return comment;
  }

  async update(id: string, updateTicketCommentDto: UpdateTicketCommentDto, userId: string) {
    // Ideally check if userId is the creator
    return this.prisma.ticketComment.update({
      where: { id },
      data: {
        comment: updateTicketCommentDto.comment,
      }
    });
  }

  async remove(id: string) {
    return this.prisma.ticketComment.delete({
      where: { id },
    });
  }
}
