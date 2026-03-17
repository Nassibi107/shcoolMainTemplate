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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(schoolId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalStudents, activeTeachers, absencesToday, paymentSummary,] = await Promise.all([
            this.prisma.student.count({ where: { schoolId, isActive: true, deletedAt: null } }),
            this.prisma.teacher.count({ where: { schoolId, isActive: true, deletedAt: null } }),
            this.prisma.attendance.count({
                where: { student: { schoolId }, date: today, status: 'ABSENT' },
            }),
            this.prisma.payment.aggregate({
                where: { schoolId, status: 'PAID', deletedAt: null },
                _sum: { amount: true },
            }),
        ]);
        return {
            totalStudents,
            activeTeachers,
            absencesToday,
            monthlyRevenue: Number(paymentSummary._sum.amount ?? 0),
        };
    }
    async getAttendanceRateByClass(schoolId) {
        const classes = await this.prisma.class.findMany({
            where: { schoolId, deletedAt: null },
            include: {
                enrollments: {
                    where: { isActive: true },
                    select: { studentId: true },
                },
            },
        });
        const results = await Promise.all(classes.map(async (cls) => {
            const studentIds = cls.enrollments.map((e) => e.studentId);
            if (studentIds.length === 0)
                return { className: cls.name, rate: 0 };
            const [total, present] = await Promise.all([
                this.prisma.attendance.count({ where: { studentId: { in: studentIds } } }),
                this.prisma.attendance.count({ where: { studentId: { in: studentIds }, status: 'PRESENT' } }),
            ]);
            return {
                classId: cls.id,
                className: cls.name,
                rate: total > 0 ? Math.round((present / total) * 100) : 0,
                totalStudents: studentIds.length,
            };
        }));
        return results;
    }
    async getRecentAuditLogs(schoolId, limit = 20) {
        return this.prisma.auditLog.findMany({
            where: { schoolId },
            include: {
                user: { select: { firstName: true, lastName: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map