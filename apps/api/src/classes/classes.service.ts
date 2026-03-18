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

export interface CreateLessonDto {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
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

  async getTimetable(schoolId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { class: { schoolId }, deletedAt: null },
      include: {
        class: { select: { id: true, name: true, code: true } },
        subject: { select: { id: true, name: true, code: true, color: true } },
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return { lessons };
  }

  async getOptions(schoolId: string) {
    const [classes, teachers, subjects] = await Promise.all([
      this.prisma.class.findMany({
        where: { schoolId, deletedAt: null, isActive: true },
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.teacher.findMany({
        where: { schoolId, deletedAt: null, isActive: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subject.findMany({
        where: { schoolId, deletedAt: null },
        select: { id: true, name: true, code: true, color: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return { classes, teachers, subjects };
  }

  async createLesson(schoolId: string, dto: CreateLessonDto) {
    const cls = await this.prisma.class.findFirst({
      where: { id: dto.classId, schoolId, deletedAt: null },
    });
    if (!cls) throw new NotFoundException('Class not found');

    const [teacher, subject] = await Promise.all([
      this.prisma.teacher.findFirst({ where: { id: dto.teacherId, schoolId, deletedAt: null } }),
      this.prisma.subject.findFirst({ where: { id: dto.subjectId, schoolId, deletedAt: null } }),
    ]);
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (!subject) throw new NotFoundException('Subject not found');

    // Conflict check: teacher cannot teach two lessons at same day/time.
    const teacherConflict = await this.prisma.lesson.findFirst({
      where: {
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        deletedAt: null,
      },
    });
    if (teacherConflict) throw new ConflictException('Teacher already assigned at this time');

    // Conflict check: class cannot have two lessons at same day/time.
    const classConflict = await this.prisma.lesson.findFirst({
      where: {
        classId: dto.classId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        deletedAt: null,
      },
    });
    if (classConflict) throw new ConflictException('Class already has a lesson at this time');

    // Max daily load: 8 hours per teacher/day.
    const teacherDailyCount = await this.prisma.lesson.count({
      where: {
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        deletedAt: null,
      },
    });
    if (teacherDailyCount >= 8) {
      throw new ConflictException('Teacher reached max hours for this day');
    }

    return this.prisma.lesson.create({
      data: {
        name: `${subject.name} - ${cls.name}`,
        classId: dto.classId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        room: dto.room,
      },
      include: {
        class: { select: { id: true, name: true, code: true } },
        subject: { select: { id: true, name: true, code: true, color: true } },
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
  }

  async getTeacherScheduleByUser(schoolId: string, userId: string, classId?: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { schoolId, userId, deletedAt: null, isActive: true },
      include: { classes: { select: { id: true, name: true, code: true } } },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    const lessons = await this.prisma.lesson.findMany({
      where: {
        teacherId: teacher.id,
        ...(classId ? { classId } : {}),
        deletedAt: null,
      },
      include: {
        class: { select: { id: true, name: true, code: true } },
        subject: { select: { id: true, name: true, code: true, color: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return { teacherId: teacher.id, classes: teacher.classes, lessons };
  }
}
