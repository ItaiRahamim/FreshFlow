import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TariffService {
  constructor(private prisma: PrismaService) {}

  async findAll(hsCode?: string, country?: string) {
    return this.prisma.tariffRate.findMany({
      where: {
        ...(hsCode && { hsCode }),
        ...(country && { country }),
      },
    });
  }

  async findByHsCode(hsCode: string) {
    return this.prisma.tariffRate.findMany({
      where: { hsCode },
    });
  }

  async uploadRates(data: Array<{ hsCode: string; country: string; dutyPercent: number; vatPercent: number }>) {
    const operations = data.map((rate) =>
      this.prisma.tariffRate.upsert({
        where: {
          hsCode_country: {
            hsCode: rate.hsCode,
            country: rate.country,
          },
        },
        update: {
          dutyPercent: rate.dutyPercent,
          vatPercent: rate.vatPercent,
          lastSyncedAt: new Date(),
        },
        create: {
          hsCode: rate.hsCode,
          country: rate.country,
          dutyPercent: rate.dutyPercent,
          vatPercent: rate.vatPercent,
          lastSyncedAt: new Date(),
        },
      }),
    );

    return Promise.all(operations);
  }
}

