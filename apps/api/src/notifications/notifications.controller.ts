import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService, SendNotificationDto } from './notifications.service';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getForUser(@CurrentUser() user: JwtPayload, @Query('unread') unread?: string) {
    return this.notificationsService.getForUser(user.sub, unread === 'true');
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.getUnreadCount(user.sub);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAsRead(id, user.sub);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllAsRead(user.sub);
  }

  @Post('send')
  @Roles(Role.ADMIN)
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Post('teacher-request')
  @Roles(Role.TEACHER)
  notifyTeacherRequest(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { title: string; body: string; link?: string },
  ) {
    return this.notificationsService.notifyAdminsAndAssistants(
      user.schoolId,
      dto.title,
      dto.body,
      dto.link,
    );
  }
}
