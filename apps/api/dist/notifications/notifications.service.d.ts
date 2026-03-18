import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
export interface SendNotificationDto {
    userId: string;
    schoolId: string;
    type: NotificationType;
    title: string;
    body: string;
    link?: string;
    channel?: NotificationChannel;
}
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    send(dto: SendNotificationDto): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        body: string;
        link: string | null;
        isRead: boolean;
        sentAt: Date | null;
    }>;
    getForUser(userId: string, onlyUnread?: boolean): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        body: string;
        link: string | null;
        isRead: boolean;
        sentAt: Date | null;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    notifyAdminsAndAssistants(schoolId: string, title: string, body: string, link?: string): Promise<{
        sent: number;
    }>;
    private dispatchExternal;
}
