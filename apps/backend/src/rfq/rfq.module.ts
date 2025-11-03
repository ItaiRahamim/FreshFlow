import { Module } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  controllers: [RfqController],
  providers: [RfqService, PrismaService],
  exports: [RfqService],
  imports: [AuditLogModule],
})
export class RfqModule {}

