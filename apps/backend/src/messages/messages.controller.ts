import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all messages' })
  async findAll(@CurrentUser() user: any) {
    return this.messagesService.findAll(user.id);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Send message' })
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.messagesService.create(data, user.id);
  }
}

