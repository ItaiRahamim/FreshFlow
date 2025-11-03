import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('categories/:categoryId/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all products in category' })
  async findAll(@Param('categoryId') categoryId: string, @CurrentCompany() companyId: string) {
    return this.productsService.findAll(categoryId, companyId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.productsService.findOne(id, companyId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create product' })
  async create(@Param('categoryId') categoryId: string, @Body() data: any) {
    return this.productsService.create(data, categoryId);
  }
}

