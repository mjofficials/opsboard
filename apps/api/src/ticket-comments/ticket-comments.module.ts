import { Module } from '@nestjs/common';
import { TicketCommentsService } from './ticket-comments.service.js';
import { TicketCommentsController } from './ticket-comments.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [TicketCommentsController],
  providers: [TicketCommentsService],
})
export class TicketCommentsModule {}
