import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService],
  exports: [InvoicesService],
  imports: [AuditLogModule],
})
export class InvoicesModule {}

