import { PaymentStatus } from '@prisma/client';
import { Response } from 'express';
import { PaymentsService, CreatePaymentDto, UpdatePaymentStatusDto } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(schoolId: string, dto: CreatePaymentDto): Promise<any>;
    findAll(schoolId: string, status?: PaymentStatus, studentId?: string): Promise<any>;
    getSummary(schoolId: string): Promise<{
        totalCollected: number;
        pending: number;
        overdue: number;
    }>;
    getMonthlyRevenue(schoolId: string): Promise<{
        month: string;
        revenue: number;
    }[]>;
    exportExcel(schoolId: string, res: Response): Promise<void>;
    updateStatus(id: string, schoolId: string, dto: UpdatePaymentStatusDto): Promise<any>;
}
