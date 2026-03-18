import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../certificates/pdf.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {}

  async getDashboardStats(schoolId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeTeachers,
      parentCount,
      absencesToday,
      paymentSummary,
    ] = await Promise.all([
      this.prisma.student.count({ where: { schoolId, isActive: true, deletedAt: null } }),
      this.prisma.teacher.count({ where: { schoolId, isActive: true, deletedAt: null } }),
      this.prisma.parent.count({ where: { schoolId, isActive: true, deletedAt: null } }),
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
      parentCount,
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

  async getMonthlyRevenue(schoolId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { schoolId, status: 'PAID', deletedAt: null },
      select: { paidAt: true, amount: true },
    });
    const byMonth: Record<string, number> = {};
    for (const p of payments) {
      if (!p.paidAt) continue;
      const key = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] ?? 0) + Number(p.amount);
    }
    return Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue }));
  }

  async getGradeDistribution(schoolId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { student: { schoolId } },
      select: { score: true, maxScore: true },
    });
    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const g of grades) {
      const pct = Number(g.score) / Number(g.maxScore || 100);
      if (pct >= 0.9) dist.A++;
      else if (pct >= 0.8) dist.B++;
      else if (pct >= 0.7) dist.C++;
      else if (pct >= 0.6) dist.D++;
      else dist.F++;
    }
    return dist;
  }

  async exportReportPdf(schoolId: string, reportId: string): Promise<Buffer> {
    const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) throw new Error('School not found');

    const [stats, attendanceByClass, revenue] = await Promise.all([
      this.getDashboardStats(schoolId),
      this.getAttendanceRateByClass(schoolId),
      this.getMonthlyRevenue(schoolId),
    ]);

    const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><style>
body{font-family:system-ui,sans-serif;padding:20px;color:#1C2B3A;}
h1{color:#0F1F3D;}h2{margin-top:24px;color:#3D5A80;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #ddd;padding:8px;text-align:left;}
th{background:#f4f7fa;}
</style></head><body>
<h1>${school.name} — Report</h1>
<p>Generated: ${new Date().toLocaleString()}</p>
<h2>Summary</h2>
<ul>
<li>Total Students: ${stats.totalStudents}</li>
<li>Active Teachers: ${stats.activeTeachers}</li>
<li>Monthly Revenue: $${stats.monthlyRevenue.toLocaleString()}</li>
<li>Absences Today: ${stats.absencesToday}</li>
</ul>
<h2>Attendance by Class</h2>
<table><tr><th>Class</th><th>Rate (%)</th></tr>
${attendanceByClass.map((c) => `<tr><td>${c.className}</td><td>${c.rate}</td></tr>`).join('')}
</table>
<h2>Monthly Revenue</h2>
<table><tr><th>Month</th><th>Revenue</th></tr>
${revenue.map((r) => `<tr><td>${r.month}</td><td>$${r.revenue.toLocaleString()}</td></tr>`).join('')}
</table>
</body></html>`;
    return this.pdfService.generateFromHtml(html);
  }

  async exportReportExcel(schoolId: string, reportId: string): Promise<Buffer> {
    const [stats, attendanceByClass, revenue] = await Promise.all([
      this.getDashboardStats(schoolId),
      this.getAttendanceRateByClass(schoolId),
      this.getMonthlyRevenue(schoolId),
    ]);

    const wb = new ExcelJS.Workbook();
    const summarySheet = wb.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 25 },
    ];
    summarySheet.addRow({ metric: 'Total Students', value: stats.totalStudents });
    summarySheet.addRow({ metric: 'Active Teachers', value: stats.activeTeachers });
    summarySheet.addRow({ metric: 'Monthly Revenue', value: stats.monthlyRevenue });
    summarySheet.addRow({ metric: 'Absences Today', value: stats.absencesToday });

    const attendanceSheet = wb.addWorksheet('Attendance by Class');
    attendanceSheet.columns = [
      { header: 'Class', key: 'className', width: 20 },
      { header: 'Rate (%)', key: 'rate', width: 25 },
    ];
    attendanceByClass.forEach((c) => attendanceSheet.addRow({ className: c.className, rate: c.rate }));

    const revenueSheet = wb.addWorksheet('Monthly Revenue');
    revenueSheet.columns = [
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Revenue', key: 'revenue', width: 20 },
    ];
    revenue.forEach((r) => revenueSheet.addRow({ month: r.month, revenue: r.revenue }));

    const buffer = await wb.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
