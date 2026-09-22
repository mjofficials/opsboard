import { IsOptional, IsEnum } from 'class-validator';
import { MemberStatus, Role } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TeamFilterDto {
    @ApiPropertyOptional({ enum: MemberStatus })
    @IsOptional()
    @IsEnum(MemberStatus)
    status?: MemberStatus;

    @ApiPropertyOptional({ enum: Role })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
