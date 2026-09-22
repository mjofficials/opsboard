import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string, organizationId: string) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        organizationId: organizationId,
        createdBy: userId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
    });
  }

  async findOne(id: string, organizationId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId },
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, organizationId: string) {
    // Check if it exists and belongs to the org first
    await this.findOne(id, organizationId);
    
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string, organizationId: string) {
    // Check if it exists and belongs to the org first
    await this.findOne(id, organizationId);
    
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
