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
const pdf_service_1 = require("../certificates/pdf.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, pdfService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
    }
    async getFeeTypes(schoolId) {
        return this.prisma.feeType.findMany({
            where: { schoolId, isActive: true, deletedAt: null },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                category: true,
                amount: true,
            },
        });
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
    async getByStudent(schoolId, studentId, month) {
        const where = { schoolId, studentId, deletedAt: null };
        if (month) {
            const [year, monthNum] = month.split('-').map((v) => parseInt(v, 10));
            if (!Number.isNaN(year) && !Number.isNaN(monthNum)) {
                const start = new Date(year, monthNum - 1, 1);
                const end = new Date(year, monthNum, 1);
                where.dueDate = { gte: start, lt: end };
            }
        }
        return this.prisma.payment.findMany({
            where,
            include: {
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
                feeType: { select: { name: true, category: true } },
            },
            orderBy: { dueDate: 'desc' },
        });
    }
    async getStudentIdByUser(schoolId, userId) {
        const student = await this.prisma.student.findFirst({
            where: { schoolId, userId, deletedAt: null },
            select: { id: true },
        });
        return student?.id ?? null;
    }
    async exportStudentPaymentsExcel(schoolId, studentId, month) {
        const payments = await this.getByStudent(schoolId, studentId, month);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Monthly Payment Report');
        sheet.columns = [
            { header: 'Student', key: 'student', width: 28 },
            { header: 'Fee Type', key: 'feeType', width: 24 },
            { header: 'Amount', key: 'amount', width: 12 },
            { header: 'Status', key: 'status', width: 14 },
            { header: 'Due Date', key: 'dueDate', width: 14 },
            { header: 'Paid At', key: 'paidAt', width: 14 },
            { header: 'Reference', key: 'reference', width: 24 },
        ];
        sheet.getRow(1).font = { bold: true };
        for (const p of payments) {
            sheet.addRow({
                student: `${p.student.user.firstName} ${p.student.user.lastName}`,
                feeType: p.feeType.name,
                amount: Number(p.amount),
                status: p.status,
                dueDate: p.dueDate?.toISOString().slice(0, 10),
                paidAt: p.paidAt ? p.paidAt.toISOString().slice(0, 10) : '',
                reference: p.reference ?? '',
            });
        }
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const paid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0);
        const pending = total - paid;
        sheet.addRow({});
        sheet.addRow({ student: 'TOTAL', amount: total, status: '' });
        sheet.addRow({ student: 'PAID', amount: paid, status: '' });
        sheet.addRow({ student: 'PENDING', amount: pending, status: '' });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async exportStudentPaymentsPdf(schoolId, studentId, month) {
        const payments = await this.getByStudent(schoolId, studentId, month);
        const student = payments[0]?.student ?? (await this.prisma.student.findFirst({
            where: { id: studentId, schoolId },
            include: { user: { select: { firstName: true, lastName: true } } },
        }));
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const paid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0);
        const pending = total - paid;
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #1C2B3A; }
    h1 { color: #0F1F3D; margin: 0 0 8px; }
    .meta { color: #6B7A90; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #DDE3EA; padding: 8px; font-size: 12px; text-align: left; }
    th { background: #F4F7FA; }
    .summary { margin-top: 16px; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Monthly Payment Report</h1>
  <div class="meta">Student: ${student.user.firstName} ${student.user.lastName} ${month ? `| Month: ${month}` : ''}</div>
  <table>
    <thead>
      <tr>
        <th>Fee Type</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Due Date</th>
        <th>Paid At</th>
      </tr>
    </thead>
    <tbody>
      ${payments.map((p) => `
        <tr>
          <td>${p.feeType.name}</td>
          <td>${Number(p.amount).toFixed(2)}</td>
          <td>${p.status}</td>
          <td>${p.dueDate ? new Date(p.dueDate).toISOString().slice(0, 10) : ''}</td>
          <td>${p.paidAt ? new Date(p.paidAt).toISOString().slice(0, 10) : ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="summary">
    <div><strong>Total:</strong> ${total.toFixed(2)}</div>
    <div><strong>Paid:</strong> ${paid.toFixed(2)}</div>
    <div><strong>Pending:</strong> ${pending.toFixed(2)}</div>
  </div>
</body>
</html>`;
        return this.pdfService.generateFromHtml(html);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map