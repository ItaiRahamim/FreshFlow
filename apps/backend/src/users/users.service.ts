import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(companyId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { companyId },
    });
  }

  async create(data: {
    email: string;
    name?: string;
    password: string;
    role: UserRole;
    companyId: string;
    supplierId?: string;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: data.role,
        companyId: data.companyId,
        supplierId: data.supplierId,
      },
    });
  }
}

