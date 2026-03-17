import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            avatarUrl: string | null;
            school: {
                name: string;
                id: string;
                slug: string;
            };
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    getMe(userId: string): Promise<{
        school: {
            name: string;
            id: string;
            slug: string;
            logoUrl: string | null;
        };
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private generateTokens;
    hashPassword(password: string): Promise<string>;
}
