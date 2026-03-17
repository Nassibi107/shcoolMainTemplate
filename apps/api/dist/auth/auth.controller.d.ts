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
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            avatarUrl: any;
            school: any;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: JwtPayload): Promise<void>;
    getMe(user: JwtPayload): Promise<any>;
}
