import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['access_token'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { 
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    
    const primaryMembership = user.memberships[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: primaryMembership?.role,
      organizationId: primaryMembership?.organizationId,
      organizations: user.memberships.map(membership => ({
        organizationId: membership.organizationId,
        role: membership.role,
        organizations: {
          name: membership.organization.name,
          logo_path: membership.organization.logoPath
        }
      }))
    };
  }
}
