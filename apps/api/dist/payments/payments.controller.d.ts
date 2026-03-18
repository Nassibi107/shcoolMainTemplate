import { PaymentStatus } from '@prisma/client';
import { Response } from 'express';
import { PaymentsService, CreatePaymentDto, UpdatePaymentStatusDto } from './payments.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(schoolId: string, dto: CreatePaymentDto): Promise<{
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
        feeType: {
            name: string;
            category: import(".prisma/client").$Enums.FeeCategory;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        feeTypeId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.PaymentStatus;
        dueDate: Date;
        paidAt: Date | null;
        reference: string | null;
        note: string | null;
    }>;
    findAll(schoolId: string, status?: PaymentStatus, studentId?: string): Promise<({
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
        feeType: {
            name: string;
            category: import(".prisma/client").$Enums.FeeCategory;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        feeTypeId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.PaymentStatus;
        dueDate: Date;
        paidAt: Date | null;
        reference: string | null;
        note: string | null;
    })[]>;
    getFeeTypes(schoolId: string): Promise<{
        name: string;
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        category: import(".prisma/client").$Enums.FeeCategory;
    }[]>;
    getSummary(schoolId: string): Promise<{
        totalCollected: number;
        pending: number;
        overdue: number;
    }>;
    getMonthlyRevenue(schoolId: string): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getMyPayments(schoolId: string, user: JwtPayload, month?: string): Promise<({
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
        feeType: {
            name: string;
            category: import(".prisma/client").$Enums.FeeCategory;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        feeTypeId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.PaymentStatus;
        dueDate: Date;
        paidAt: Date | null;
        reference: string | null;
        note: string | null;
    })[]>;
    exportMyPaymentsExcel(schoolId: string, user: JwtPayload, month: string | undefined, res: Response): Promise<void>;
    exportMyPaymentsPdf(schoolId: string, user: JwtPayload, month: string | undefined, res: Response): Promise<void>;
    getStudentPayments(schoolId: string, studentId: string, month?: string): Promise<({
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
        feeType: {
            name: string;
            category: import(".prisma/client").$Enums.FeeCategory;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        feeTypeId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.PaymentStatus;
        dueDate: Date;
        paidAt: Date | null;
        reference: string | null;
        note: string | null;
    })[]>;
    exportExcel(schoolId: string, res: Response): Promise<void>;
    updateStatus(id: string, schoolId: string, dto: UpdatePaymentStatusDto): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentId: string;
        feeTypeId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.PaymentStatus;
        dueDate: Date;
        paidAt: Date | null;
        reference: string | null;
        note: string | null;
    }>;
}
