"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const nodemailer = require("nodemailer");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async send(dto) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                schoolId: dto.schoolId,
                type: dto.type,
                title: dto.title,
                body: dto.body,
                link: dto.link,
                channel: dto.channel ?? client_1.NotificationChannel.IN_APP,
            },
        });
        if (dto.channel === client_1.NotificationChannel.EMAIL || dto.channel === client_1.NotificationChannel.SMS) {
            await this.dispatchExternal(dto);
        }
        return notification;
    }
    async getForUser(userId, onlyUnread = false) {
        return this.prisma.notification.findMany({
            where: { userId, ...(onlyUnread ? { isRead: false } : {}) },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({ where: { userId, isRead: false } });
    }
    async dispatchExternal(dto) {
        const config = await this.prisma.notificationConfig.findUnique({
            where: { schoolId: dto.schoolId },
        });
        if (!config)
            return;
        if (dto.channel === client_1.NotificationChannel.EMAIL && config.emailEnabled && config.smtpHost) {
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
            }
            catch (err) {
                this.logger.error('Email dispatch failed', err);
            }
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map