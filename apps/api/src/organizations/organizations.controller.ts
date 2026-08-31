import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  UseInterceptors,
  UploadedFile,
  Req
} from '@nestjs/common';
import 'multer';

import { OrganizationsService } from './organizations.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Organizations')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'The organization has been successfully created.' })
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.organizationsService.create(createOrganizationDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiResponse({ status: 200, description: 'Return the organization.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'The organization has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'The organization has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file')) // the frontend sends 'file' maybe? Let's check frontend. Usually 'file' or 'avatar'
  @ApiOperation({ summary: 'Upload organization avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully.', schema: { example: { url: 'https://...' } } })
  uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.organizationsService.uploadAvatar(id, file);
  }
}
