import { Controller, Get, Post, Body, Param, UseGuards, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private prisma: PrismaService,
  ) {}

  @Post('upload')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload document' })
  async upload(
    @UploadedFile() file: any,
    @Body() data: { ownerType: string; ownerId: string; type: string },
    @CurrentUser() user: any,
  ) {
    return this.documentsService.upload(
      file as any,
      data.ownerType as any,
      data.ownerId,
      data.type as any,
      user.id,
      user.companyId,
    );
  }

  @Get('owner/:ownerType/:ownerId')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get documents by owner' })
  async findAll(@Param('ownerType') ownerType: string, @Param('ownerId') ownerId: string) {
    return this.documentsService.findAll(ownerType as any, ownerId);
  }

  @Put(':id/review')
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Review document' })
  async review(
    @Param('id') id: string,
    @Body() data: { status: string; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.documentsService.review(id, user.companyId, user.id, data.status as any, data.notes);
  }

  @Get(':id/url')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get presigned URL for document' })
  async getPresignedUrl(@Param('id') id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new BadRequestException('Document not found');
    }
    return this.documentsService.getPresignedUrl(document.s3Key);
  }
}
