import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, S3Service],
  exports: [DocumentsService],
  imports: [AuditLogModule],
})
export class DocumentsModule {}

