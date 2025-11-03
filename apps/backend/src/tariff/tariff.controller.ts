import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tariff')
@ApiBearerAuth()
@Controller('tariff')
export class TariffController {
  constructor(private tariffService: TariffService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get tariff rates' })
  async findAll(@Query('hsCode') hsCode?: string, @Query('country') country?: string) {
    return this.tariffService.findAll(hsCode, country);
  }

  @Post('upload')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Upload tariff rates' })
  async uploadRates(@Body() data: Array<{ hsCode: string; country: string; dutyPercent: number; vatPercent: number }>) {
    return this.tariffService.uploadRates(data);
  }
}

