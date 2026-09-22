import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: any, userId: string, projectId: string, organizationId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId }
    });
    if (!project) throw new NotFoundException('Project not found or access denied');

    return this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        status: createTicketDto.status || 'OPEN',
        priority: createTicketDto.priority || 'MEDIUM',
        projectId: projectId,
        assigneeId: createTicketDto.assigneeId || null,
        createdBy: userId,
      },
    });
  }

  async findAll(organizationId: string, projectId?: string) {
    if (projectId) {
      return this.prisma.ticket.findMany({
        where: { projectId, project: { organizationId } },
        include: { assignee: true, creator: true }
      });
    }
    return this.prisma.ticket.findMany({
      where: { project: { organizationId } },
      include: { assignee: true, creator: true, project: true }
    });
  }

  async findOne(id: string, organizationId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, project: { organizationId } },
      include: { assignee: true, creator: true, comments: true }
    });
    if (!ticket) throw new NotFoundException();
    return ticket;
  }

  async update(id: string, updateTicketDto: any, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  async findComments(ticketId: string, organizationId: string) {
    await this.findOne(ticketId, organizationId);
    return this.prisma.ticketComment.findMany({
      where: { ticketId },
      include: { user: true }
    });
  }
}
