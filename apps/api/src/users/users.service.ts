import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    if (!organizationId) {
      return this.prisma.user.findMany();
    }
    
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    return members.map(member => ({
      ...member.user,
      role: member.role,
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
