import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, isActive: true, deletedAt: null },
      include: { school: { select: { id: true, name: true, slug: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
    });

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!tokenMatch) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.schoolId);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS) },
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { school: { select: { id: true, name: true, slug: true, logoUrl: true } } },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const { passwordHash, refreshTokenHash, ...safeUser } = user;
    return safeUser;
  }

  private async generateTokens(userId: string, email: string, role: string, schoolId: string) {
    const payload: JwtPayload = { sub: userId, email, role, schoolId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('app.jwtSecret'),
        expiresIn: this.config.get<string>('app.jwtExpiresIn') ?? '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('app.jwtRefreshSecret'),
        expiresIn: this.config.get<string>('app.jwtRefreshExpiresIn') ?? '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
