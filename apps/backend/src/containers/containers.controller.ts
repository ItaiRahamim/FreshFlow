import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('containers')
@ApiBearerAuth()
@Controller('shipments/:shipmentId/containers')
export class ContainersController {
  constructor(private containersService: ContainersService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create container' })
  async create(@Param('shipmentId') shipmentId: string, @Body() data: any) {
    return this.containersService.create(data, shipmentId);
  }

  @Put(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update container' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.containersService.update(id, data);
  }
}

