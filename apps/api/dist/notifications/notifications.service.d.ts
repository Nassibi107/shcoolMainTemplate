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
    send(dto: SendNotificationDto): Promise<any>;
    getForUser(userId: string, onlyUnread?: boolean): Promise<any>;
    markAsRead(id: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<number>;
    private dispatchExternal;
}
