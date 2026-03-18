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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, dto) {
        const existing = await this.prisma.class.findFirst({
            where: { code: dto.code, schoolId, academicYear: dto.academicYear, deletedAt: null },
        });
        if (existing)
            throw new common_1.ConflictException('Class with this code already exists for this academic year');
        return this.prisma.class.create({
            data: { ...dto, schoolId },
            include: {
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
                _count: { select: { enrollments: true, lessons: true } },
            },
        });
    }
    async findAll(schoolId) {
        return this.prisma.class.findMany({
            where: { schoolId, deletedAt: null },
            include: {
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
                _count: { select: { enrollments: true, lessons: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, schoolId) {
        const cls = await this.prisma.class.findFirst({
            where: { id, schoolId, deletedAt: null },
            include: {
                teacher: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
                enrollments: {
                    where: { isActive: true },
                    include: { student: { include: { user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } } } } },
                },
                lessons: {
                    where: { deletedAt: null },
                    include: {
                        subject: { select: { name: true, code: true, color: true } },
                        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
                    },
                    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
                },
            },
        });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        return cls;
    }
    async update(id, schoolId, dto) {
        const cls = await this.prisma.class.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        return this.prisma.class.update({ where: { id }, data: dto });
    }
    async softDelete(id, schoolId) {
        const cls = await this.prisma.class.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        await this.prisma.class.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Class removed' };
    }
    async getTimetable(schoolId) {
        const lessons = await this.prisma.lesson.findMany({
            where: { class: { schoolId }, deletedAt: null },
            include: {
                class: { select: { id: true, name: true, code: true } },
                subject: { select: { id: true, name: true, code: true, color: true } },
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        return { lessons };
    }
    async getOptions(schoolId) {
        const [classes, teachers, subjects] = await Promise.all([
            this.prisma.class.findMany({
                where: { schoolId, deletedAt: null, isActive: true },
                select: { id: true, name: true, code: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.teacher.findMany({
                where: { schoolId, deletedAt: null, isActive: true },
                include: { user: { select: { firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.subject.findMany({
                where: { schoolId, deletedAt: null },
                select: { id: true, name: true, code: true, color: true },
                orderBy: { name: 'asc' },
            }),
        ]);
        return { classes, teachers, subjects };
    }
    async createLesson(schoolId, dto) {
        const cls = await this.prisma.class.findFirst({
            where: { id: dto.classId, schoolId, deletedAt: null },
        });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        const [teacher, subject] = await Promise.all([
            this.prisma.teacher.findFirst({ where: { id: dto.teacherId, schoolId, deletedAt: null } }),
            this.prisma.subject.findFirst({ where: { id: dto.subjectId, schoolId, deletedAt: null } }),
        ]);
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        const teacherConflict = await this.prisma.lesson.findFirst({
            where: {
                teacherId: dto.teacherId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                deletedAt: null,
            },
        });
        if (teacherConflict)
            throw new common_1.ConflictException('Teacher already assigned at this time');
        const classConflict = await this.prisma.lesson.findFirst({
            where: {
                classId: dto.classId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                deletedAt: null,
            },
        });
        if (classConflict)
            throw new common_1.ConflictException('Class already has a lesson at this time');
        const teacherDailyCount = await this.prisma.lesson.count({
            where: {
                teacherId: dto.teacherId,
                dayOfWeek: dto.dayOfWeek,
                deletedAt: null,
            },
        });
        if (teacherDailyCount >= 8) {
            throw new common_1.ConflictException('Teacher reached max hours for this day');
        }
        return this.prisma.lesson.create({
            data: {
                name: `${subject.name} - ${cls.name}`,
                classId: dto.classId,
                subjectId: dto.subjectId,
                teacherId: dto.teacherId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                room: dto.room,
            },
            include: {
                class: { select: { id: true, name: true, code: true } },
                subject: { select: { id: true, name: true, code: true, color: true } },
                teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
    }
    async getTeacherScheduleByUser(schoolId, userId, classId) {
        const teacher = await this.prisma.teacher.findFirst({
            where: { schoolId, userId, deletedAt: null, isActive: true },
            include: { classes: { select: { id: true, name: true, code: true } } },
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        const lessons = await this.prisma.lesson.findMany({
            where: {
                teacherId: teacher.id,
                ...(classId ? { classId } : {}),
                deletedAt: null,
            },
            include: {
                class: { select: { id: true, name: true, code: true } },
                subject: { select: { id: true, name: true, code: true, color: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        return { teacherId: teacher.id, classes: teacher.classes, lessons };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map