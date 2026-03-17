import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';
export interface CreatePaymentDto {
    studentId: string;
    feeTypeId: string;
    amount: number;
    dueDate: string;
    note?: string;
}
export interface UpdatePaymentStatusDto {
    status: PaymentStatus;
    paidAt?: string;
    reference?: string;
}
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, dto: CreatePaymentDto): Promise<any>;
    findAll(schoolId: string, filters: {
        status?: PaymentStatus;
        studentId?: string;
    }): Promise<any>;
    updateStatus(id: string, schoolId: string, dto: UpdatePaymentStatusDto): Promise<any>;
    getSummary(schoolId: string): Promise<{
        totalCollected: number;
        pending: number;
        overdue: number;
    }>;
    getMonthlyRevenue(schoolId: string): Promise<{
        month: string;
        revenue: number;
    }[]>;
    exportToExcel(schoolId: string): Promise<Buffer>;
}
