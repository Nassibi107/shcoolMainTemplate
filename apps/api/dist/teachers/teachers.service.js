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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const client_1 = require("@prisma/client");
let TeachersService = class TeachersService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async create(schoolId, dto) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email, schoolId, deletedAt: null },
        });
        if (existing)
            throw new common_1.ConflictException('User with this email already exists');
        const count = await this.prisma.teacher.count({ where: { schoolId } });
        const employeeCode = `TCH-${String(count + 1).padStart(4, '0')}`;
        const passwordHash = await this.authService.hashPassword(dto.password);
        return this.prisma.teacher.create({
            data: {
                employeeCode,
                qualification: dto.qualification,
                specialization: dto.specialization,
                salary: dto.salary ?? 0,
                school: { connect: { id: schoolId } },
                user: {
                    create: {
                        email: dto.email,
                        passwordHash,
                        role: client_1.Role.TEACHER,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        phone: dto.phone,
                        schoolId,
                    },
                },
            },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true } },
                classes: { select: { id: true, name: true, code: true } },
            },
        });
    }
    async findAll(schoolId) {
        return this.prisma.teacher.findMany({
            where: { schoolId, deletedAt: null },
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true, isActive: true },
                },
                classes: { select: { id: true, name: true, code: true } },
                _count: { select: { lessons: true, grades: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, schoolId) {
        const teacher = await this.prisma.teacher.findFirst({
            where: { id, schoolId, deletedAt: null },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
                classes: true,
                lessons: {
                    include: {
                        subject: { select: { name: true, code: true } },
                        class: { select: { name: true, code: true } },
                    },
                },
                salaryPayments: { orderBy: { month: 'desc' }, take: 12 },
            },
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return teacher;
    }
    async update(id, schoolId, dto) {
        const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        const { firstName, lastName, phone, isActive, ...teacherFields } = dto;
        await this.prisma.teacher.update({
            where: { id },
            data: {
                ...teacherFields,
                ...(firstName || lastName || phone !== undefined ? {
                    user: { update: { firstName, lastName, phone, isActive } },
                } : {}),
            },
        });
        return this.findOne(id, schoolId);
    }
    async softDelete(id, schoolId) {
        const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        await this.prisma.teacher.update({ where: { id }, data: { deletedAt: new Date() } });
        await this.prisma.user.update({ where: { id: teacher.userId }, data: { deletedAt: new Date(), isActive: false } });
        return { message: 'Teacher removed' };
    }
    async getSchedule(id, schoolId) {
        const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return this.prisma.lesson.findMany({
            where: { teacherId: id, deletedAt: null },
            include: {
                subject: { select: { name: true, code: true, color: true } },
                class: { select: { name: true, code: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map