import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(schoolId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeTeachers,
      absencesToday,
      paymentSummary,
    ] = await Promise.all([
      this.prisma.student.count({ where: { schoolId, isActive: true, deletedAt: null } }),
      this.prisma.teacher.count({ where: { schoolId, isActive: true, deletedAt: null } }),
      this.prisma.attendance.count({
        where: { student: { schoolId }, date: today, status: 'ABSENT' },
      }),
      this.prisma.payment.aggregate({
        where: { schoolId, status: 'PAID', deletedAt: null },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalStudents,
      activeTeachers,
      absencesToday,
      monthlyRevenue: Number(paymentSummary._sum.amount ?? 0),
    };
  }

  async getAttendanceRateByClass(schoolId: string) {
    const classes = await this.prisma.class.findMany({
      where: { schoolId, deletedAt: null },
      include: {
        enrollments: {
          where: { isActive: true },
          select: { studentId: true },
        },
      },
    });

    const results = await Promise.all(
      classes.map(async (cls) => {
        const studentIds = cls.enrollments.map((e) => e.studentId);
        if (studentIds.length === 0) return { className: cls.name, rate: 0 };

        const [total, present] = await Promise.all([
          this.prisma.attendance.count({ where: { studentId: { in: studentIds } } }),
          this.prisma.attendance.count({ where: { studentId: { in: studentIds }, status: 'PRESENT' } }),
        ]);

        return {
          classId: cls.id,
          className: cls.name,
          rate: total > 0 ? Math.round((present / total) * 100) : 0,
          totalStudents: studentIds.length,
        };
      }),
    );

    return results;
  }

  async getRecentAuditLogs(schoolId: string, limit = 20) {
    return this.prisma.auditLog.findMany({
      where: { schoolId },
      include: {
        user: { select: { firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
