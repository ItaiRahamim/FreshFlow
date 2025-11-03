import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { TariffController } from './tariff.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tariff',
    }),
  ],
  controllers: [TariffController],
  providers: [TariffService, PrismaService],
  exports: [TariffService],
})
export class TariffModule {}

