import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentCompany } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all categories' })
  async findAll(@CurrentCompany() companyId: string) {
    return this.categoriesService.findAll(companyId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Param('id') id: string, @CurrentCompany() companyId: string) {
    return this.categoriesService.findOne(id, companyId);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create category' })
  async create(@Body() data: any, @CurrentCompany() companyId: string) {
    return this.categoriesService.create(data, companyId);
  }
}

