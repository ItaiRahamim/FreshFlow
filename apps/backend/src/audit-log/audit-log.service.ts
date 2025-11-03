import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(action: string, entityType: string, entityId: string, userId: string | null, before: any, after: any, ipAddress?: string, userAgent?: string) {
    return this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        before,
        after,
        ipAddress,
        userAgent,
      },
    });
  }
}

