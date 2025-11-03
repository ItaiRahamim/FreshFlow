import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get all notifications' })
  async findAll(@CurrentUser() user: any) {
    return this.notificationsService.findAll(user.id);
  }

  @Put(':id/read')
  @Roles(UserRole.OWNER, UserRole.STAFF, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}

