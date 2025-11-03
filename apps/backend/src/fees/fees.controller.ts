import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('fees')
@ApiBearerAuth()
@Controller('fees')
export class FeesController {
  constructor(private feesService: FeesService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all fees' })
  async findAll() {
    return this.feesService.findAll();
  }

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create fee' })
  async create(@Body() data: any) {
    return this.feesService.create(data);
  }
}

