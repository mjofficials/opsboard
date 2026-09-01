import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantAls } from '../als/tenant.als.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let tenantId = null;

    // Check for explicit tenant header (useful for server-to-server or specific overrides)
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) {
      tenantId = headerTenant;
    } else {
      // Extract from JWT cookie
      const token = req.cookies?.['access_token'];
      if (token) {
        try {
          const decoded = this.jwtService.decode(token) as any;
          if (decoded && decoded.tenantId) {
            tenantId = decoded.tenantId;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    tenantAls.run({ tenantId }, () => {
      next();
    });
  }
}
