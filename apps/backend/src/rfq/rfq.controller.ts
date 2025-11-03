import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('rfq')
@ApiBearerAuth()
@Controller('rfq')
export class RfqController {
  constructor(private rfqService: RfqService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all RFQs' })
  async findAll(@CurrentCompany() companyId: string) {
    return this.rfqService.findAll(companyId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get RFQ by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.rfqService.findOne(id, companyId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create RFQ' })
  async create(@Body() data: any, @CurrentCompany() companyId: string) {
    return this.rfqService.create(data, companyId);
  }
}

