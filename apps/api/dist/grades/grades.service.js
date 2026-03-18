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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradesService = class GradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertGrade(dto) {
        const maxScore = dto.maxScore ?? 20;
        if (maxScore <= 0 || maxScore > 20) {
            throw new common_1.BadRequestException('maxScore must be between 1 and 20');
        }
        if (dto.score < 0 || dto.score > maxScore) {
            throw new common_1.BadRequestException(`score must be between 0 and ${maxScore}`);
        }
        return this.prisma.grade.upsert({
            where: {
                studentId_subjectId_term: {
                    studentId: dto.studentId,
                    subjectId: dto.subjectId,
                    term: dto.term,
                },
            },
            create: {
                studentId: dto.studentId,
                subjectId: dto.subjectId,
                teacherId: dto.teacherId,
                term: dto.term,
                score: dto.score,
                maxScore,
                letterGrade: dto.letterGrade,
                note: dto.note,
            },
            update: {
                score: dto.score,
                maxScore,
                letterGrade: dto.letterGrade,
                note: dto.note,
                teacherId: dto.teacherId,
                gradedAt: new Date(),
            },
            include: {
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
                subject: { select: { name: true, code: true } },
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
    }
    async bulkUpsert(grades) {
        return Promise.all(grades.map((g) => this.upsertGrade(g)));
    }
    async getStudentGrades(studentId, term) {
        const where = { studentId };
        if (term)
            where.term = term;
        return this.prisma.grade.findMany({
            where,
            include: {
                subject: { select: { name: true, code: true, color: true } },
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
            orderBy: [{ term: 'desc' }, { subject: { name: 'asc' } }],
        });
    }
    async getClassGrades(classId, subjectId, term) {
        const enrollments = await this.prisma.classEnrollment.findMany({
            where: { classId, isActive: true },
            select: { studentId: true },
        });
        const studentIds = enrollments.map((e) => e.studentId);
        return this.prisma.grade.findMany({
            where: { studentId: { in: studentIds }, subjectId, term },
            include: {
                student: {
                    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
                },
            },
            orderBy: { score: 'desc' },
        });
    }
    async getGradeDistribution(schoolId, term) {
        const grades = await this.prisma.grade.findMany({
            where: { student: { schoolId }, term },
            select: { score: true, maxScore: true },
        });
        const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        for (const g of grades) {
            const pct = (Number(g.score) / Number(g.maxScore)) * 100;
            if (pct >= 90)
                distribution.A++;
            else if (pct >= 80)
                distribution.B++;
            else if (pct >= 70)
                distribution.C++;
            else if (pct >= 60)
                distribution.D++;
            else
                distribution.F++;
        }
        return distribution;
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map