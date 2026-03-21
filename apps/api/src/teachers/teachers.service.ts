import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '@prisma/client';

export interface CreateTeacherDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  qualification?: string;
  specialization?: string;
  salary?: number;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  qualification?: string;
  specialization?: string;
  salary?: number;
  isActive?: boolean;
}

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(schoolId: string, dto: CreateTeacherDto) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, schoolId, deletedAt: null },
    });
    if (existing) throw new ConflictException('User with this email already exists');

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
            role: Role.TEACHER,
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

  async findAll(schoolId: string) {
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

  async findOne(id: string, schoolId: string) {
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
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, schoolId: string, dto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
    if (!teacher) throw new NotFoundException('Teacher not found');

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

  async softDelete(id: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    await this.prisma.teacher.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.prisma.user.update({ where: { id: teacher.userId }, data: { deletedAt: new Date(), isActive: false } });
    return { message: 'Teacher removed' };
  }

  async getSchedule(id: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findFirst({ where: { id, schoolId, deletedAt: null } });
    if (!teacher) throw new NotFoundException('Teacher not found');

    return this.prisma.lesson.findMany({
      where: { teacherId: id, deletedAt: null },
      include: {
        subject: { select: { name: true, code: true, color: true } },
        class: { select: { name: true, code: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getMySchedule(userId: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { userId, schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!teacher) throw new NotFoundException('Teacher profile not found for this user');
    return this.getSchedule(teacher.id, schoolId);
  }
}
