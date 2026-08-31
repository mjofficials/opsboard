import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProjectDto: CreateProjectDto, userId: string): Promise<{
        name: string;
        id: string;
        status: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        assignee_id: string | null;
        created_by: string | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        status: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        assignee_id: string | null;
        created_by: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        status: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        assignee_id: string | null;
        created_by: string | null;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        name: string;
        id: string;
        status: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        assignee_id: string | null;
        created_by: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        status: string;
        organization_id: string;
        created_at: Date;
        updated_at: Date;
        description: string | null;
        assignee_id: string | null;
        created_by: string | null;
    }>;
}
