import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a ticket' })
  create(@Body() createTicketDto: any, @Req() req: any) {
    return this.ticketsService.create(createTicketDto, req.user.id, createTicketDto.projectId);
  }

  @Get()
  @ApiOperation({ summary: 'List all tickets' })
  findAll(@Query('projectId') projectId?: string) {
    return this.ticketsService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a ticket' })
  findComments(@Param('id') id: string) {
    return this.ticketsService.findComments(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  update(@Param('id') id: string, @Body() updateTicketDto: any) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
