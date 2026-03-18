import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
import * as nodemailer from 'nodemailer';

export interface SendNotificationDto {
  userId: string;
  schoolId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  channel?: NotificationChannel;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async send(dto: SendNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        schoolId: dto.schoolId,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        link: dto.link,
        channel: dto.channel ?? NotificationChannel.IN_APP,
      },
    });

    if (dto.channel === NotificationChannel.EMAIL || dto.channel === NotificationChannel.SMS) {
      await this.dispatchExternal(dto);
    }

    return notification;
  }

  async getForUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(onlyUnread ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async notifyAdminsAndAssistants(
    schoolId: string,
    title: string,
    body: string,
    link?: string,
  ) {
    const targets = await this.prisma.user.findMany({
      where: {
        schoolId,
        role: { in: ['ADMIN', 'ASSISTANT'] },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    for (const target of targets) {
      await this.send({
        userId: target.id,
        schoolId,
        type: NotificationType.INFO,
        title,
        body,
        link,
      });
    }

    return { sent: targets.length };
  }

  private async dispatchExternal(dto: SendNotificationDto) {
    const config = await this.prisma.notificationConfig.findUnique({
      where: { schoolId: dto.schoolId },
    });

    if (!config) return;

    if (dto.channel === NotificationChannel.EMAIL && config.emailEnabled && config.smtpHost) {
      try {
        const transporter = nodemailer.createTransport({
          host: config.smtpHost,
          port: config.smtpPort ?? 587,
          auth: { user: config.smtpUser ?? '', pass: config.smtpPass ?? '' },
        });

        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (user) {
          await transporter.sendMail({
            to: user.email,
            subject: dto.title,
            text: dto.body,
          });
        }
      } catch (err) {
        this.logger.error('Email dispatch failed', err);
      }
    }
  }
}
