import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: any, fromUserId: string) {
    return this.prisma.message.create({
      data: {
        ...data,
        fromUserId,
      },
    });
  }
}

