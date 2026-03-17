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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalendarService = class CalendarService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(schoolId, dto) {
        return this.prisma.calendarEvent.create({
            data: {
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                schoolId,
            },
        });
    }
    async findAll(schoolId, filters) {
        const where = { schoolId, deletedAt: null };
        if (filters.type)
            where.type = filters.type;
        if (filters.from || filters.to) {
            where.startDate = {};
            if (filters.from)
                where.startDate.gte = new Date(filters.from);
            if (filters.to)
                where.startDate.lte = new Date(filters.to);
        }
        return this.prisma.calendarEvent.findMany({
            where,
            orderBy: { startDate: 'asc' },
        });
    }
    async update(id, schoolId, dto) {
        const event = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return this.prisma.calendarEvent.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
                ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
            },
        });
    }
    async remove(id, schoolId) {
        const event = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        await this.prisma.calendarEvent.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Event removed' };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map