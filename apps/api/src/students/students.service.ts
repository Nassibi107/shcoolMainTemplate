import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { Role } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(schoolId: string, dto: CreateStudentDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email, schoolId, deletedAt: null },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const studentCount = await this.prisma.student.count({ where: { schoolId } });
    const studentCode = `STU-${String(studentCount + 1).padStart(5, '0')}`;

    const passwordHash = await this.authService.hashPassword(dto.password);

    const student = await this.prisma.student.create({
      data: {
        studentCode,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        address: dto.address,
        ...(dto.parentId ? { parent: { connect: { id: dto.parentId } } } : {}),
        school: { connect: { id: schoolId } },
        user: {
          create: {
            email: dto.email,
            passwordHash,
            role: Role.STUDENT,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            schoolId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
          },
        },
        parent: {
          include: {
            user: { select: { firstName: true, lastName: true, phone: true } },
          },
        },
        classEnrollments: {
          where: { isActive: true },
          include: { class: { select: { id: true, name: true, code: true } } },
        },
      },
    });

    if (dto.classId) {
      await this.prisma.classEnrollment.create({
        data: { studentId: student.id, classId: dto.classId },
      });
    }

    return student;
  }

  async findByUserId(userId: string, schoolId: string) {
    return this.prisma.student.findFirst({
      where: { userId, schoolId, deletedAt: null },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        classEnrollments: {
          where: { isActive: true },
          include: { class: { select: { id: true, name: true, code: true } } },
        },
      },
    });
  }

  async findByParentId(parentUserId: string, schoolId: string) {
    const parent = await this.prisma.parent.findFirst({
      where: { userId: parentUserId, schoolId },
    });
    if (!parent) return [];

    return this.prisma.student.findMany({
      where: { parentId: parent.id, schoolId, deletedAt: null },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        classEnrollments: {
          where: { isActive: true },
          include: { class: { select: { id: true, name: true, code: true } } },
        },
      },
    });
  }

  async findAll(schoolId: string, filters: FilterStudentsDto) {
    const { search, classId, isActive, paymentStatus, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { schoolId, deletedAt: null };

    if (typeof isActive === 'string') {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { studentCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (classId) {
      where.classEnrollments = { some: { classId, isActive: true } };
    }

    if (paymentStatus) {
      where.payments = { some: { status: paymentStatus } };
    }

    const [total, students] = await Promise.all([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatarUrl: true,
              isActive: true,
            },
          },
          classEnrollments: {
            where: { isActive: true },
            include: { class: { select: { id: true, name: true, code: true } } },
          },
          payments: {
            where: { deletedAt: null },
            select: { status: true, amount: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        parent: {
          include: {
            user: {
              select: { firstName: true, lastName: true, phone: true, email: true },
            },
          },
        },
        classEnrollments: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                code: true,
                academicYear: true,
                teacher: {
                  include: {
                    user: { select: { firstName: true, lastName: true } },
                  },
                },
              },
            },
          },
        },
        grades: {
          include: { subject: { select: { name: true, code: true } } },
          orderBy: { gradedAt: 'desc' },
          take: 20,
        },
        payments: {
          where: { deletedAt: null },
          include: { feeType: { select: { name: true, category: true } } },
          orderBy: { dueDate: 'desc' },
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
          include: { lesson: { include: { subject: { select: { name: true } } } } },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, schoolId: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
    });

    if (!student) throw new NotFoundException('Student not found');

    const { classId, ...studentData } = dto;

    const parentRelationUpdate =
      studentData.parentId === undefined
        ? {}
        : studentData.parentId
          ? { parent: { connect: { id: studentData.parentId } } }
          : { parent: { disconnect: true } };

    await this.prisma.student.update({
      where: { id },
      data: {
        ...(studentData.dateOfBirth ? { dateOfBirth: new Date(studentData.dateOfBirth) } : {}),
        gender: studentData.gender,
        address: studentData.address,
        ...parentRelationUpdate,
        user: {
          update: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            phone: studentData.phone,
          },
        },
      },
    });

    if (classId) {
      const existingEnrollment = await this.prisma.classEnrollment.findFirst({
        where: { studentId: id, classId, isActive: true },
      });

      if (!existingEnrollment) {
        await this.prisma.classEnrollment.updateMany({
          where: { studentId: id, isActive: true },
          data: { isActive: false, leftAt: new Date() },
        });
        await this.prisma.classEnrollment.create({
          data: { studentId: id, classId },
        });
      }
    }

    return this.findOne(id, schoolId);
  }

  async softDelete(id: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
    });

    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    await this.prisma.user.update({
      where: { id: student.userId },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { message: 'Student removed successfully' };
  }

  async getAttendanceSummary(id: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');

    const [total, present, absent, late] = await Promise.all([
      this.prisma.attendance.count({ where: { studentId: id } }),
      this.prisma.attendance.count({ where: { studentId: id, status: 'PRESENT' } }),
      this.prisma.attendance.count({ where: { studentId: id, status: 'ABSENT' } }),
      this.prisma.attendance.count({ where: { studentId: id, status: 'LATE' } }),
    ]);

    return {
      total,
      present,
      absent,
      late,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : '0',
    };
  }
}
