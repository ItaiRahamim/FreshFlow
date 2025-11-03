import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany, CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all quotes' })
  async findAll(@CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.quotesService.findAll(companyId, supplierId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get quote by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    const supplierId = user.role === UserRole.SUPPLIER ? user.supplierId : undefined;
    return this.quotesService.findOne(id, companyId, supplierId);
  }

  @Post()
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Create quote' })
  async create(@Body() data: any, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    return this.quotesService.create(data, companyId, user.supplierId);
  }

  @Put(':id/accept')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Accept quote' })
  async accept(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.quotesService.accept(id, companyId);
  }
}

