import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, schoolId: dto.schoolId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists in this school');
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

  async findAll(schoolId: string) {
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

  async findOne(id: string, schoolId: string) {
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

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, schoolId: string, dto: UpdateUserDto) {
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

  async deactivate(id: string, schoolId: string) {
    await this.findOne(id, schoolId);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async softDelete(id: string, schoolId: string) {
    await this.findOne(id, schoolId);
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
