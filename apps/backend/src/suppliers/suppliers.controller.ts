import { Controller, Get, Post, Body, Param, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentCompany } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all suppliers' })
  async findAll(@CurrentCompany() companyId: string, @Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.suppliersService.findByCategory(categoryId, companyId);
    }
    return this.suppliersService.findAll(companyId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get supplier by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string, @CurrentUser() user: any) {
    // Suppliers can only see their own data
    if (user.role === UserRole.SUPPLIER && user.supplierId !== id) {
      throw new ForbiddenException();
    }
    return this.suppliersService.findOne(id, companyId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create supplier' })
  async create(@Body() data: any, @CurrentCompany() companyId: string) {
    return this.suppliersService.create(data, companyId);
  }
}

