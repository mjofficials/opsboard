import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        memberships: {
          create: {
            role: 'OWNER',
            organization: {
              create: {
                name: `${registerDto.name}'s Organization`,
              }
            }
          }
        }
      },
      include: {
        memberships: {
          include: { organization: true }
        }
      }
    } as any);

    const activeMembership = (user as any).memberships[0];
    const payload = { sub: user.id, email: user.email, tenantId: activeMembership?.organizationId };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenant_id: activeMembership?.organizationId,
        organizations: (user as any).memberships.map((m: any) => ({
          organization_id: m.organizationId,
          role: m.role,
          name: m.organization.name,
          logo_path: m.organization.logoPath
        }))
      }
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        memberships: {
          include: { organization: true }
        }
      }
    } as any);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const activeMembership = (user as any).memberships[0];
    const payload = { sub: user.id, email: user.email, tenantId: activeMembership?.organizationId };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenant_id: activeMembership?.organizationId,
        organizations: (user as any).memberships.map((m: any) => ({
          organization_id: m.organizationId,
          role: m.role,
          name: m.organization.name,
          logo_path: m.organization.logoPath
        }))
      }
    };
  }
}
