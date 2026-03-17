import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: JwtPayload): Promise<void>;
    getMe(user: JwtPayload): Promise<{
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
}
