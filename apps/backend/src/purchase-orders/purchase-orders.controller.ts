import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany, CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('purchase-orders')
@ApiBearerAuth()
@Controller('po')
export class PurchaseOrdersController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all purchase orders' })
  async findAll(@CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.purchaseOrdersService.findAll(companyId, supplierId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get purchase order by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.purchaseOrdersService.findOne(id, companyId, supplierId);
  }

  @Post('from-quote/:quoteId')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create PO from quote' })
  async createFromQuote(@Param('quoteId') quoteId: string, @CurrentCompany() companyId: string) {
    return this.purchaseOrdersService.createFromQuote(quoteId, companyId);
  }
}

