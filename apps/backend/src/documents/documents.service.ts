import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { DocumentOwnerType, DocumentStatus, DocumentType } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async upload(
    file: { buffer: Buffer; originalname: string; mimetype: string },
    ownerType: DocumentOwnerType,
    ownerId: string,
    type: DocumentType,
    uploadedById: string,
    companyId: string,
  ) {
    // Upload to S3
    const s3Key = await this.s3Service.uploadFile(file);

    // Create document record
    return this.prisma.document.create({
      data: {
        ownerType,
        ownerId,
        type,
        status: 'UPLOADED',
        s3Key,
        uploadedById,
      },
    });
  }

  async review(id: string, companyId: string, reviewedById: string, status: DocumentStatus, notes?: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Reviewer cannot be uploader
    if (document.uploadedById === reviewedById) {
      throw new ForbiddenException('Reviewer cannot be the uploader');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status,
        reviewedById,
        notes,
        version: document.version + 1,
      },
    });
  }

  async getPresignedUrl(s3Key: string) {
    return this.s3Service.getPresignedUrl(s3Key);
  }

  async findAll(ownerType: DocumentOwnerType, ownerId: string) {
    return this.prisma.document.findMany({
      where: {
        ownerType,
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

