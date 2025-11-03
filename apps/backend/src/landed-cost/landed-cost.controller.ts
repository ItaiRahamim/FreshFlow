import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LandedCostService } from './landed-cost.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('landed-cost')
@ApiBearerAuth()
@Controller('landed-cost')
export class LandedCostController {
  constructor(private landedCostService: LandedCostService) {}

  @Post('calculate')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Calculate landed cost' })
  async calculate(@Body() inputs: any) {
    return this.landedCostService.calculate(inputs);
  }
}

