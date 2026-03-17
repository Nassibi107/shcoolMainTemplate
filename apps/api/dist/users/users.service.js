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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let UsersService = class UsersService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async create(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email, schoolId: dto.schoolId, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException('A user with this email already exists in this school');
        }
        const passwordHash = await this.authService.hashPassword(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                role: dto.role,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                schoolId: dto.schoolId,
            },
        });
        const { passwordHash: _, refreshTokenHash: __, ...safeUser } = user;
        return safeUser;
    }
    async findAll(schoolId) {
        const users = await this.prisma.user.findMany({
            where: { schoolId, deletedAt: null },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return users;
    }
    async findOne(id, schoolId) {
        const user = await this.prisma.user.findFirst({
            where: { id, schoolId, deletedAt: null },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatarUrl: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
                school: { select: { id: true, name: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, schoolId, dto) {
        await this.findOne(id, schoolId);
        const updated = await this.prisma.user.update({
            where: { id },
            data: { ...dto },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                isActive: true,
                updatedAt: true,
            },
        });
        return updated;
    }
    async deactivate(id, schoolId) {
        await this.findOne(id, schoolId);
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async softDelete(id, schoolId) {
        await this.findOne(id, schoolId);
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map