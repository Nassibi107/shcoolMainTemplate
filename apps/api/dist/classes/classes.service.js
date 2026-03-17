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
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map