import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId: string, companyId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        category: {
          companyId,
        },
      },
    });
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
        category: {
          companyId,
        },
      },
      include: {
        category: true,
      },
    });
  }

  async create(data: any, categoryId: string) {
    return this.prisma.product.create({
      data: {
        ...data,
        categoryId,
      },
    });
  }
}

