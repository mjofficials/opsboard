import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TicketCommentsService } from './ticket-comments.service.js';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto.js';
import { UpdateTicketCommentDto } from './dto/update-ticket-comment.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket Comments')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('ticket-comments')
export class TicketCommentsController {
  constructor(private readonly ticketCommentsService: TicketCommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a ticket comment' })
  create(@Body() createTicketCommentDto: any, @Req() req: any) {
    return this.ticketCommentsService.create(createTicketCommentDto, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket comment' })
  findOne(@Param('id') id: string) {
    return this.ticketCommentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket comment' })
  update(@Param('id') id: string, @Body() updateTicketCommentDto: any, @Req() req: any) {
    return this.ticketCommentsService.update(id, updateTicketCommentDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket comment' })
  remove(@Param('id') id: string) {
    return this.ticketCommentsService.remove(id);
  }
}
