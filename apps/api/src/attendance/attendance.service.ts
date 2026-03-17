import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

export interface MarkAttendanceDto {
  lessonId: string;
  date: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }>;
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markBulk(schoolId: string, dto: MarkAttendanceDto) {
    const lesson = await this.prisma.lesson.findFirst({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const date = new Date(dto.date);

    const upsertPromises = dto.records.map((record) =>
      this.prisma.attendance.upsert({
        where: {
          studentId_lessonId_date: {
            studentId: record.studentId,
            lessonId: dto.lessonId,
            date,
          },
        },
        create: {
          studentId: record.studentId,
          lessonId: dto.lessonId,
          date,
          status: record.status,
          note: record.note,
        },
        update: {
          status: record.status,
          note: record.note,
        },
      }),
    );

    await Promise.all(upsertPromises);

    // check for students with 3+ consecutive absences and trigger notification
    for (const record of dto.records.filter((r) => r.status === 'ABSENT')) {
      await this.checkConsecutiveAbsences(record.studentId, dto.lessonId);
    }

    return { marked: dto.records.length };
  }

  private async checkConsecutiveAbsences(studentId: string, lessonId: string) {
    const recent = await this.prisma.attendance.findMany({
      where: { studentId, lessonId },
      orderBy: { date: 'desc' },
      take: 3,
    });

    const allAbsent = recent.length >= 3 && recent.every((a) => a.status === 'ABSENT');

    if (allAbsent) {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (student) {
        await this.prisma.notification.create({
          data: {
            userId: student.userId,
            schoolId: student.schoolId,
            type: 'ABSENCE_ALERT',
            title: 'Consecutive Absence Alert',
            body: `${student.user.firstName} has been absent for 3 or more consecutive sessions.`,
            channel: 'IN_APP',
          },
        });
      }
    }
  }

  async getClassAttendance(classId: string, date: string, schoolId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { classId, deletedAt: null },
      select: { id: true },
    });

    const lessonIds = lessons.map((l) => l.id);
    const dateObj = new Date(date);

    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { classId, isActive: true },
      include: {
        student: {
          include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        },
      },
    });

    const attendanceRecords = await this.prisma.attendance.findMany({
      where: { lessonId: { in: lessonIds }, date: dateObj },
    });

    const attendanceMap = new Map(
      attendanceRecords.map((a) => [`${a.studentId}-${a.lessonId}`, a]),
    );

    return enrollments.map((enrollment) => ({
      student: enrollment.student,
      attendance: lessonIds.map((lessonId) => ({
        lessonId,
        record: attendanceMap.get(`${enrollment.studentId}-${lessonId}`) ?? null,
      })),
    }));
  }

  async getStudentAttendance(studentId: string, filters: { from?: string; to?: string }) {
    const where: any = { studentId };

    if (filters.from || filters.to) {
      where.date = {};
      if (filters.from) where.date.gte = new Date(filters.from);
      if (filters.to) where.date.lte = new Date(filters.to);
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        lesson: {
          include: {
            subject: { select: { name: true, code: true } },
            class: { select: { name: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getDailyReport(schoolId: string, date: string) {
    const dateObj = new Date(date);

    const [total, present, absent, late] = await Promise.all([
      this.prisma.attendance.count({ where: { date: dateObj, student: { schoolId } } }),
      this.prisma.attendance.count({ where: { date: dateObj, status: 'PRESENT', student: { schoolId } } }),
      this.prisma.attendance.count({ where: { date: dateObj, status: 'ABSENT', student: { schoolId } } }),
      this.prisma.attendance.count({ where: { date: dateObj, status: 'LATE', student: { schoolId } } }),
    ]);

    return { date, total, present, absent, late };
  }
}
