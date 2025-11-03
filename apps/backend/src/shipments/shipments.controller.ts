import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany, CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('shipments')
@ApiBearerAuth()
@Controller('shipments')
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentsService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all shipments' })
  async findAll(@CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.shipmentsService.findAll(companyId, supplierId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get shipment by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.shipmentsService.findOne(id, companyId, supplierId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create shipment' })
  async create(@Body() data: any, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    return this.shipmentsService.create(data, companyId, data.supplierId);
  }

  @Put(':id/status')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update shipment status' })
  async updateStatus(@Param('id') id: string, @Body() data: { status: string }, @CurrentCompany() companyId: string) {
    return this.shipmentsService.updateStatus(id, companyId, data.status);
  }
}

