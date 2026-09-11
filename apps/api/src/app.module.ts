import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { validate } from './env.validation.js';
import { TenantMiddleware } from './common/middleware/tenant.middleware.js';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module.js';
import { TeamsModule } from './teams/teams.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { TicketCommentsModule } from './ticket-comments/ticket-comments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.register({}), // for decoding in middleware
    PrismaModule,
    AuthModule,
    ProjectsModule,
    OrganizationsModule,
    UsersModule,
    TeamsModule,
    TicketsModule,
    TicketCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
