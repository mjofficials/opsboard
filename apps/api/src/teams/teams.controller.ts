import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Invite a team member' })
  @ApiResponse({ status: 201, description: 'Invitation sent.' })
  create(@Body() createTeamDto: any, @Req() req: any) {
    return this.teamsService.create(req.user.organizationId, createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({ status: 200, description: 'Return all team members.' })
  findAll(@Req() req: any) {
    return this.teamsService.findAll(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team member by id' })
  @ApiResponse({ status: 200, description: 'Return the team member.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.teamsService.findOne(id, req.user.organizationId);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a team invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted.' })
  accept(@Param('id') id: string, @Req() req: any) {
    return this.teamsService.accept(id, req.user.id, req.user.email);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a team invitation' })
  @ApiResponse({ status: 200, description: 'Invitation rejected.' })
  reject(@Param('id') id: string) {
    return this.teamsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a team member' })
  @ApiResponse({ status: 200, description: 'The team member has been removed.' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
