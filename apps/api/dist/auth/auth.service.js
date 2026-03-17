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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const BCRYPT_SALT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email, isActive: true, deletedAt: null },
            include: { school: { select: { id: true, name: true, slug: true } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.schoolId);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshTokenHash: await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS),
                lastLoginAt: new Date(),
            },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatarUrl: user.avatarUrl,
                school: user.school,
            },
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, isActive: true, deletedAt: null },
        });
        if (!user?.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokenMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!tokenMatch) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.schoolId);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS) },
        });
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: null },
        });
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { school: { select: { id: true, name: true, slug: true, logoUrl: true } } },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const { passwordHash, refreshTokenHash, ...safeUser } = user;
        return safeUser;
    }
    async generateTokens(userId, email, role, schoolId) {
        const payload = { sub: userId, email, role, schoolId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('app.jwtSecret'),
                expiresIn: this.config.get('app.jwtExpiresIn') ?? '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('app.jwtRefreshSecret'),
                expiresIn: this.config.get('app.jwtRefreshExpiresIn') ?? '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async hashPassword(password) {
        return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map