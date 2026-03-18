import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CertificatesService } from '../certificates/certificates.service';
import { DocumentRequestStatus } from '@prisma/client';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ApproveRejectDocumentRequestDto } from './dto/approve-reject.dto';
export declare class DocumentRequestsService {
    private prisma;
    private notificationsService;
    private certificatesService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, certificatesService: CertificatesService);
    create(schoolId: string, requesterId: string, dto: CreateDocumentRequestDto): Promise<{
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            parentId: string | null;
            studentCode: string;
            enrollmentDate: Date;
            userId: string;
        };
        requester: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        status: import(".prisma/client").$Enums.DocumentRequestStatus;
        note: string | null;
        documentType: string;
        approverNote: string | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        requesterId: string;
        approverId: string | null;
        certificateId: string | null;
    }>;
    findAll(schoolId: string, filters: {
        status?: DocumentRequestStatus;
    }): Promise<({
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
            classEnrollments: ({
                class: {
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                enrolledAt: Date;
                leftAt: Date | null;
                studentId: string;
            })[];
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            parentId: string | null;
            studentCode: string;
            enrollmentDate: Date;
            userId: string;
        };
        requester: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        status: import(".prisma/client").$Enums.DocumentRequestStatus;
        note: string | null;
        documentType: string;
        approverNote: string | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        requesterId: string;
        approverId: string | null;
        certificateId: string | null;
    })[]>;
    findForRequester(requesterId: string, schoolId: string): Promise<({
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
            classEnrollments: ({
                class: {
                    name: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                enrolledAt: Date;
                leftAt: Date | null;
                studentId: string;
            })[];
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            parentId: string | null;
            studentCode: string;
            enrollmentDate: Date;
            userId: string;
        };
        certificate: {
            id: string;
            pdfUrl: string | null;
        } | null;
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        status: import(".prisma/client").$Enums.DocumentRequestStatus;
        note: string | null;
        documentType: string;
        approverNote: string | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        requesterId: string;
        approverId: string | null;
        certificateId: string | null;
    })[]>;
    approve(id: string, schoolId: string, approverId: string, dto: ApproveRejectDocumentRequestDto): Promise<({
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            parentId: string | null;
            studentCode: string;
            enrollmentDate: Date;
            userId: string;
        };
        certificate: {
            id: string;
        } | null;
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        status: import(".prisma/client").$Enums.DocumentRequestStatus;
        note: string | null;
        documentType: string;
        approverNote: string | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        requesterId: string;
        approverId: string | null;
        certificateId: string | null;
    }) | null>;
    reject(id: string, schoolId: string, approverId: string, dto: ApproveRejectDocumentRequestDto): Promise<{
        success: boolean;
    }>;
    getPendingCount(schoolId: string): Promise<number>;
    private mapDocumentTypeToCertType;
}
