import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service.js';
import { TeamFilterDto } from './dto/team-filter.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamsService {
  private resend: Resend;

  constructor(private readonly prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY || 'mock_key');
  }

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

    const inviteToken = randomBytes(32).toString('hex');

    const member = await this.prisma.organizationMember.create({
      data: {
        email,
        role: role || 'MEMBER',
        organizationId,
        status: 'PENDING',
        inviteToken,
      }
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite?token=${inviteToken}`;
    
    if (process.env.RESEND_API_KEY) {
      try {
        await this.resend.emails.send({
          from: 'Opsboard <onboarding@resend.dev>',
          to: email,
          subject: 'You have been invited to join Opsboard',
          html: `<p>You have been invited to join an organization on Opsboard.</p><p><a href="${inviteUrl}">Click here to accept the invitation and sign up</a></p>`
        });
      } catch (error) {
        console.error('Failed to send invite email:', error);
      }
    } else {
      console.log(`\n[Mock Email] User invited. Link: ${inviteUrl}\n`);
    }

    return member;
  }

  async findAll(teamFilterDto: TeamFilterDto, organizationId: string) {
    const {role, status} = teamFilterDto;

    return this.prisma.organizationMember.findMany({
      where: { 
        organizationId,
        role,
        status,
      }
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

  async acceptInviteByToken(token: string, userId: string, email: string) {
    const member = await this.prisma.organizationMember.findUnique({ where: { inviteToken: token } });
    
    if (!member) throw new NotFoundException('Invalid or expired invitation token');
    if (member.email !== email) throw new ConflictException('This invitation was sent to a different email address');
    if (member.status !== 'PENDING') throw new ConflictException('This invitation has already been processed');

    return this.prisma.organizationMember.update({
      where: { id: member.id },
      data: {
        status: 'ACCEPTED',
        userId,
        inviteToken: null,
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
