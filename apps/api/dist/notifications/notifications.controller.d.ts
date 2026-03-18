import { NotificationsService, SendNotificationDto } from './notifications.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getForUser(user: JwtPayload, unread?: string): Promise<{
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
    getUnreadCount(user: JwtPayload): Promise<number>;
    markAsRead(id: string, user: JwtPayload): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(user: JwtPayload): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
    notifyTeacherRequest(user: JwtPayload, dto: {
        title: string;
        body: string;
        link?: string;
    }): Promise<{
        sent: number;
    }>;
}
