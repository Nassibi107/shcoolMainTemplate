import { NotificationsService, SendNotificationDto } from './notifications.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getForUser(user: JwtPayload, unread?: string): Promise<any>;
    getUnreadCount(user: JwtPayload): Promise<number>;
    markAsRead(id: string, user: JwtPayload): Promise<any>;
    markAllAsRead(user: JwtPayload): Promise<any>;
    send(dto: SendNotificationDto): Promise<any>;
}
