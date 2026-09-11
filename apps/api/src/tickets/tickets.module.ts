import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
