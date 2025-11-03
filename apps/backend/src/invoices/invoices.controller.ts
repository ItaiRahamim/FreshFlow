import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany, CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all invoices' })
  async findAll(@CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.invoicesService.findAll(companyId, supplierId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get invoice by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.invoicesService.findOne(id, companyId, supplierId);
  }

  @Post()
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Create invoice' })
  async create(@Body() data: any, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    return this.invoicesService.create(data, companyId, user.supplierId);
  }

  @Put(':id/approve')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Approve invoice' })
  async approve(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.invoicesService.approve(id, companyId);
  }
}

