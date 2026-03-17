import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateClassDto {
  name: string;
  code: string;
  level?: string;
  capacity?: number;
  academicYear: string;
  teacherId?: string;
}

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateClassDto) {
    const existing = await this.prisma.class.findFirst({
      where: { code: dto.code, schoolId, academicYear: dto.academicYear, deletedAt: null },
    });
    if (existing) throw new ConflictException('Class with this code already exists for this academic year');

    return this.prisma.class.create({
      data: { ...dto, schoolId },
      include: {
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { enrollments: true, lessons: true } },
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId, deletedAt: null },
      include: {
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { enrollments: true, lessons: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, schoolId: string) {
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
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async update(id: string, schoolId: string, dto: Partial<CreateClassDto>) {
    const cls = await this.prisma.class.findFirst({ where: { id, schoolId, deletedAt: null } });
    if (!cls) throw new NotFoundException('Class not found');
    return this.prisma.class.update({ where: { id }, data: dto });
  }

  async softDelete(id: string, schoolId: string) {
    const cls = await this.prisma.class.findFirst({ where: { id, schoolId, deletedAt: null } });
    if (!cls) throw new NotFoundException('Class not found');
    await this.prisma.class.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Class removed' };
  }
}
