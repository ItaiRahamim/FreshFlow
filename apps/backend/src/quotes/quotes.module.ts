import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, PrismaService],
  exports: [QuotesService],
  imports: [AuditLogModule],
})
export class QuotesModule {}

