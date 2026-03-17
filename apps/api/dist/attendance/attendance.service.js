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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markBulk(schoolId, dto) {
        const lesson = await this.prisma.lesson.findFirst({ where: { id: dto.lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const date = new Date(dto.date);
        const upsertPromises = dto.records.map((record) => this.prisma.attendance.upsert({
            where: {
                studentId_lessonId_date: {
                    studentId: record.studentId,
                    lessonId: dto.lessonId,
                    date,
                },
            },
            create: {
                studentId: record.studentId,
                lessonId: dto.lessonId,
                date,
                status: record.status,
                note: record.note,
            },
            update: {
                status: record.status,
                note: record.note,
            },
        }));
        await Promise.all(upsertPromises);
        for (const record of dto.records.filter((r) => r.status === 'ABSENT')) {
            await this.checkConsecutiveAbsences(record.studentId, dto.lessonId);
        }
        return { marked: dto.records.length };
    }
    async checkConsecutiveAbsences(studentId, lessonId) {
        const recent = await this.prisma.attendance.findMany({
            where: { studentId, lessonId },
            orderBy: { date: 'desc' },
            take: 3,
        });
        const allAbsent = recent.length >= 3 && recent.every((a) => a.status === 'ABSENT');
        if (allAbsent) {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { user: true },
            });
            if (student) {
                await this.prisma.notification.create({
                    data: {
                        userId: student.userId,
                        schoolId: student.schoolId,
                        type: 'ABSENCE_ALERT',
                        title: 'Consecutive Absence Alert',
                        body: `${student.user.firstName} has been absent for 3 or more consecutive sessions.`,
                        channel: 'IN_APP',
                    },
                });
            }
        }
    }
    async getClassAttendance(classId, date, schoolId) {
        const lessons = await this.prisma.lesson.findMany({
            where: { classId, deletedAt: null },
            select: { id: true },
        });
        const lessonIds = lessons.map((l) => l.id);
        const dateObj = new Date(date);
        const enrollments = await this.prisma.classEnrollment.findMany({
            where: { classId, isActive: true },
            include: {
                student: {
                    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
                },
            },
        });
        const attendanceRecords = await this.prisma.attendance.findMany({
            where: { lessonId: { in: lessonIds }, date: dateObj },
        });
        const attendanceMap = new Map(attendanceRecords.map((a) => [`${a.studentId}-${a.lessonId}`, a]));
        return enrollments.map((enrollment) => ({
            student: enrollment.student,
            attendance: lessonIds.map((lessonId) => ({
                lessonId,
                record: attendanceMap.get(`${enrollment.studentId}-${lessonId}`) ?? null,
            })),
        }));
    }
    async getStudentAttendance(studentId, filters) {
        const where = { studentId };
        if (filters.from || filters.to) {
            where.date = {};
            if (filters.from)
                where.date.gte = new Date(filters.from);
            if (filters.to)
                where.date.lte = new Date(filters.to);
        }
        return this.prisma.attendance.findMany({
            where,
            include: {
                lesson: {
                    include: {
                        subject: { select: { name: true, code: true } },
                        class: { select: { name: true } },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getDailyReport(schoolId, date) {
        const dateObj = new Date(date);
        const [total, present, absent, late] = await Promise.all([
            this.prisma.attendance.count({ where: { date: dateObj, student: { schoolId } } }),
            this.prisma.attendance.count({ where: { date: dateObj, status: 'PRESENT', student: { schoolId } } }),
            this.prisma.attendance.count({ where: { date: dateObj, status: 'ABSENT', student: { schoolId } } }),
            this.prisma.attendance.count({ where: { date: dateObj, status: 'LATE', student: { schoolId } } }),
        ]);
        return { date, total, present, absent, late };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map