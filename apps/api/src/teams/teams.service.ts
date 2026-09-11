import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, createTeamDto: any) {
    const { email, role } = createTeamDto;
    
    const existing = await this.prisma.organizationMember.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId
        }
      }
    });

    if (existing) {
      throw new ConflictException('Invitation already sent to this email');
    }

    return this.prisma.organizationMember.create({
      data: {
        email,
        role: role || 'MEMBER',
        organizationId,
        status: 'PENDING'
      }
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.organizationMember.findMany({
      where: { organizationId }
    });
  }

  async findOne(id: string, organizationId: string) {
    const member = await this.prisma.organizationMember.findFirst({
      where: { id, organizationId }
    });
    if (!member) throw new NotFoundException();
    return member;
  }

  async accept(id: string, userId: string, email: string) {
    const member = await this.prisma.organizationMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException();

    return this.prisma.organizationMember.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        userId, // link the user
      }
    });
  }

  async reject(id: string) {
    return this.prisma.organizationMember.update({
      where: { id },
      data: {
        status: 'REJECTED'
      }
    });
  }

  async remove(id: string) {
    return this.prisma.organizationMember.delete({
      where: { id }
    });
  }
}
