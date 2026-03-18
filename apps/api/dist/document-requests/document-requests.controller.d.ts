import { DocumentRequestStatus } from '@prisma/client';
import { DocumentRequestsService } from './document-requests.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ApproveRejectDocumentRequestDto } from './dto/approve-reject.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class DocumentRequestsController {
    private documentRequestsService;
    constructor(documentRequestsService: DocumentRequestsService);
    create(schoolId: string, user: JwtPayload, dto: CreateDocumentRequestDto): Promise<{
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
    findAll(schoolId: string, status?: DocumentRequestStatus): Promise<({
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
    findMy(schoolId: string, user: JwtPayload): Promise<({
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
    getPendingCount(schoolId: string): Promise<number>;
    approve(id: string, schoolId: string, user: JwtPayload, dto: ApproveRejectDocumentRequestDto): Promise<({
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
    reject(id: string, schoolId: string, user: JwtPayload, dto: ApproveRejectDocumentRequestDto): Promise<{
        success: boolean;
    }>;
}
