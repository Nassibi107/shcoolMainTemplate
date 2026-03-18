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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const certificates_service_1 = require("../certificates/certificates.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let DocumentRequestsService = class DocumentRequestsService {
    constructor(prisma, notificationsService, certificatesService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.certificatesService = certificatesService;
    }
    async create(schoolId, requesterId, dto) {
        const student = await this.prisma.student.findFirst({
            where: { id: dto.studentId, schoolId },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const request = await this.prisma.documentRequest.create({
            data: {
                requesterId,
                studentId: dto.studentId,
                schoolId,
                documentType: dto.documentType,
                note: dto.note,
            },
            include: {
                requester: { select: { firstName: true, lastName: true } },
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
        const requesterName = `${request.requester.firstName} ${request.requester.lastName}`;
        const notificationBody = `${requesterName} requested a ${dto.documentType} — ${new Date().toLocaleString()}`;
        const adminAndAssistantUsers = await this.prisma.user.findMany({
            where: {
                schoolId,
                role: { in: ['ADMIN', 'ASSISTANT'] },
                isActive: true,
                deletedAt: null,
            },
            select: { id: true },
        });
        for (const u of adminAndAssistantUsers) {
            await this.notificationsService.send({
                userId: u.id,
                schoolId,
                type: client_2.NotificationType.DOCUMENT_REQUEST,
                title: 'New Document Request',
                body: notificationBody,
                link: '/notifications',
            });
        }
        return request;
    }
    async findAll(schoolId, filters) {
        const where = { schoolId };
        if (filters.status)
            where.status = filters.status;
        return this.prisma.documentRequest.findMany({
            where,
            include: {
                requester: { select: { firstName: true, lastName: true, email: true } },
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                        classEnrollments: {
                            where: { isActive: true },
                            include: { class: { select: { name: true, code: true } } },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findForRequester(requesterId, schoolId) {
        return this.prisma.documentRequest.findMany({
            where: { requesterId, schoolId },
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                        classEnrollments: {
                            where: { isActive: true },
                            include: { class: { select: { name: true } } },
                        },
                    },
                },
                certificate: { select: { id: true, pdfUrl: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approve(id, schoolId, approverId, dto) {
        const request = await this.prisma.documentRequest.findFirst({
            where: { id, schoolId },
            include: {
                requester: { select: { id: true, firstName: true, lastName: true, role: true } },
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
        if (!request)
            throw new common_1.NotFoundException('Document request not found');
        if (request.status !== client_1.DocumentRequestStatus.PENDING) {
            throw new common_1.ForbiddenException('Request is no longer pending');
        }
        const certType = this.mapDocumentTypeToCertType(request.documentType);
        await this.certificatesService.generate(schoolId, {
            studentId: request.studentId,
            type: certType,
        });
        const certificate = await this.prisma.certificate.findFirst({
            where: { studentId: request.studentId, schoolId, type: certType },
            orderBy: { issuedAt: 'desc' },
        });
        if (!certificate)
            throw new common_1.NotFoundException('Certificate was not created');
        await this.prisma.documentRequest.update({
            where: { id },
            data: {
                status: client_1.DocumentRequestStatus.APPROVED,
                approverId,
                approverNote: dto.note,
                certificateId: certificate.id,
                approvedAt: new Date(),
            },
        });
        const message = `Your ${request.documentType} request has been approved. Click here to download.`;
        await this.notificationsService.send({
            userId: request.requesterId,
            schoolId,
            type: client_2.NotificationType.DOCUMENT_READY,
            title: 'Document Request Approved',
            body: message,
            link: request.requester.role === 'PARENT' ? '/parent/documents' : '/student/certificates',
        });
        return this.prisma.documentRequest.findUnique({
            where: { id },
            include: {
                certificate: { select: { id: true } },
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
    }
    async reject(id, schoolId, approverId, dto) {
        const request = await this.prisma.documentRequest.findFirst({
            where: { id, schoolId },
            include: { requester: { select: { id: true } } },
        });
        if (!request)
            throw new common_1.NotFoundException('Document request not found');
        if (request.status !== client_1.DocumentRequestStatus.PENDING) {
            throw new common_1.ForbiddenException('Request is no longer pending');
        }
        await this.prisma.documentRequest.update({
            where: { id },
            data: {
                status: client_1.DocumentRequestStatus.REJECTED,
                approverId,
                approverNote: dto.note,
                rejectedAt: new Date(),
            },
        });
        const reason = dto.note ? ` Reason: ${dto.note}` : '';
        const message = `Your ${request.documentType} request was rejected.${reason}`;
        await this.notificationsService.send({
            userId: request.requesterId,
            schoolId,
            type: client_2.NotificationType.DOCUMENT_READY,
            title: 'Document Request Rejected',
            body: message,
        });
        return { success: true };
    }
    async getPendingCount(schoolId) {
        return this.prisma.documentRequest.count({
            where: { schoolId, status: client_1.DocumentRequestStatus.PENDING },
        });
    }
    mapDocumentTypeToCertType(documentType) {
        const map = {
            'Registration Certificate': 'REGISTRATION',
            'Attendance Certificate': 'ATTENDANCE',
            'Grade Report': 'GRADUATION_REPORT',
            'Completion Certificate': 'COMPLETION',
            'Good Conduct Certificate': 'CUSTOM',
            'Medical Exemption': 'CUSTOM',
        };
        return map[documentType] ?? 'CUSTOM';
    }
};
exports.DocumentRequestsService = DocumentRequestsService;
exports.DocumentRequestsService = DocumentRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        certificates_service_1.CertificatesService])
], DocumentRequestsService);
//# sourceMappingURL=document-requests.service.js.map