import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(invoiceId: string, companyId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    return this.prisma.payment.findMany({
      where: { invoiceId },
    });
  }

  async create(data: any, invoiceId: string, companyId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    return this.prisma.payment.create({
      data: {
        ...data,
        invoiceId,
      },
    });
  }

  async acknowledge(id: string, invoiceId: string, supplierId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, supplierId },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        supplierAck: true,
        status: 'ACKNOWLEDGED',
      },
    });
  }

  async markReceived(id: string, invoiceId: string, supplierId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, supplierId },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'RECEIVED',
      },
    });
  }
}

