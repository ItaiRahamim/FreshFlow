import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.feesTable.findMany({
      where: { isActive: true },
    });
  }

  async create(data: any) {
    return this.prisma.feesTable.create({ data });
  }
}

