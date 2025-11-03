import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContainersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, shipmentId: string) {
    // Validate container number format: ^[A-Z]{4}[0-9]{7}$
    const containerNoRegex = /^[A-Z]{4}[0-9]{7}$/;
    if (!containerNoRegex.test(data.containerNo)) {
      throw new BadRequestException('Container number must match format: 4 letters followed by 7 digits');
    }

    return this.prisma.container.create({
      data: {
        ...data,
        shipmentId,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.container.update({
      where: { id },
      data,
    });
  }
}

