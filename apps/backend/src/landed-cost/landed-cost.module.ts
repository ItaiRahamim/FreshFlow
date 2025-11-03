import { Module } from '@nestjs/common';
import { LandedCostService } from './landed-cost.service';
import { LandedCostController } from './landed-cost.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TariffModule } from '../tariff/tariff.module';
import { FeesModule } from '../fees/fees.module';

@Module({
  imports: [TariffModule, FeesModule],
  controllers: [LandedCostController],
  providers: [LandedCostService, PrismaService],
  exports: [LandedCostService],
})
export class LandedCostModule {}

