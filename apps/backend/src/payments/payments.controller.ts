import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany, CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('invoices/:invoiceId/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all payments for invoice' })
  async findAll(@Param('invoiceId') invoiceId: string, @CurrentCompany() companyId: string) {
    return this.paymentsService.findAll(invoiceId, companyId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create payment' })
  async create(@Param('invoiceId') invoiceId: string, @Body() data: any, @CurrentCompany() companyId: string) {
    return this.paymentsService.create(data, invoiceId, companyId);
  }

  @Put(':id/acknowledge')
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Acknowledge payment' })
  async acknowledge(@Param('id') id: string, @Param('invoiceId') invoiceId: string, @CurrentUser() user: any) {
    return this.paymentsService.acknowledge(id, invoiceId, user.supplierId);
  }

  @Put(':id/received')
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Mark payment as received' })
  async markReceived(@Param('id') id: string, @Param('invoiceId') invoiceId: string, @CurrentUser() user: any) {
    return this.paymentsService.markReceived(id, invoiceId, user.supplierId);
  }
}

