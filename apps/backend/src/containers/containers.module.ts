import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ContainersController],
  providers: [ContainersService, PrismaService],
  exports: [ContainersService],
})
export class ContainersModule {}

