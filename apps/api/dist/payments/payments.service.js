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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = require("exceljs");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, dto) {
        return this.prisma.payment.create({
            data: {
                studentId: dto.studentId,
                feeTypeId: dto.feeTypeId,
                schoolId,
                amount: dto.amount,
                dueDate: new Date(dto.dueDate),
                note: dto.note,
            },
            include: {
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
                feeType: { select: { name: true, category: true } },
            },
        });
    }
    async findAll(schoolId, filters) {
        const where = { schoolId, deletedAt: null };
        if (filters.status)
            where.status = filters.status;
        if (filters.studentId)
            where.studentId = filters.studentId;
        return this.prisma.payment.findMany({
            where,
            include: {
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
                feeType: { select: { name: true, category: true } },
            },
            orderBy: { dueDate: 'desc' },
        });
    }
    async updateStatus(id, schoolId, dto) {
        const payment = await this.prisma.payment.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return this.prisma.payment.update({
            where: { id },
            data: {
                status: dto.status,
                paidAt: dto.paidAt ? new Date(dto.paidAt) : (dto.status === 'PAID' ? new Date() : undefined),
                reference: dto.reference,
            },
        });
    }
    async getSummary(schoolId) {
        const [totalCollected, pending, overdue] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { schoolId, status: 'PAID', deletedAt: null },
                _sum: { amount: true },
            }),
            this.prisma.payment.aggregate({
                where: { schoolId, status: 'PENDING', deletedAt: null },
                _sum: { amount: true },
            }),
            this.prisma.payment.aggregate({
                where: { schoolId, status: 'OVERDUE', deletedAt: null },
                _sum: { amount: true },
            }),
        ]);
        return {
            totalCollected: Number(totalCollected._sum.amount ?? 0),
            pending: Number(pending._sum.amount ?? 0),
            overdue: Number(overdue._sum.amount ?? 0),
        };
    }
    async getMonthlyRevenue(schoolId) {
        const payments = await this.prisma.payment.findMany({
            where: { schoolId, status: 'PAID', deletedAt: null },
            select: { paidAt: true, amount: true },
            orderBy: { paidAt: 'asc' },
        });
        const revenueByMonth = {};
        for (const payment of payments) {
            if (!payment.paidAt)
                continue;
            const key = `${payment.paidAt.getFullYear()}-${String(payment.paidAt.getMonth() + 1).padStart(2, '0')}`;
            revenueByMonth[key] = (revenueByMonth[key] ?? 0) + Number(payment.amount);
        }
        return Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));
    }
    async exportToExcel(schoolId) {
        const payments = await this.findAll(schoolId, {});
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Payments');
        sheet.columns = [
            { header: 'Student', key: 'student', width: 25 },
            { header: 'Fee Type', key: 'feeType', width: 20 },
            { header: 'Amount', key: 'amount', width: 12 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Due Date', key: 'dueDate', width: 15 },
            { header: 'Paid At', key: 'paidAt', width: 15 },
            { header: 'Reference', key: 'reference', width: 20 },
        ];
        sheet.getRow(1).font = { bold: true };
        for (const p of payments) {
            sheet.addRow({
                student: `${p.student.user.firstName} ${p.student.user.lastName}`,
                feeType: p.feeType.name,
                amount: Number(p.amount),
                status: p.status,
                dueDate: p.dueDate?.toISOString().split('T')[0],
                paidAt: p.paidAt?.toISOString().split('T')[0] ?? '',
                reference: p.reference ?? '',
            });
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map