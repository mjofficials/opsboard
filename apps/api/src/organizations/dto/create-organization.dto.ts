import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'The name of the organization' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The logo path of the organization', required: false })
  @IsString()
  @IsOptional()
  logoPath?: string;

  @ApiProperty({ description: 'The plan of the organization', required: false, enum: PlanType })
  @IsEnum(PlanType)
  @IsOptional()
  plan?: PlanType;

  @ApiProperty({ description: 'The billing email of the organization', required: false })
  @IsString()
  @IsOptional()
  billingEmail?: string;
}
