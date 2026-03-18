import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('schools/:schoolId/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard-stats')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getDashboardStats(@Param('schoolId') schoolId: string) {
    return this.reportsService.getDashboardStats(schoolId);
  }

  @Get('attendance-by-class')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getAttendanceByClass(@Param('schoolId') schoolId: string) {
    return this.reportsService.getAttendanceRateByClass(schoolId);
  }

  @Get('grade-distribution')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getGradeDistribution(@Param('schoolId') schoolId: string) {
    return this.reportsService.getGradeDistribution(schoolId);
  }

  @Get('audit-logs')
  @Roles(Role.ADMIN)
  getAuditLogs(@Param('schoolId') schoolId: string, @Query('limit') limit?: string) {
    return this.reportsService.getRecentAuditLogs(schoolId, limit ? parseInt(limit) : 20);
  }

  @Get('export/:reportId/pdf')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  async exportPdf(
    @Param('schoolId') schoolId: string,
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportReportPdf(schoolId, reportId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${reportId}-${new Date().toISOString().slice(0, 10)}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('export/:reportId/excel')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  async exportExcel(
    @Param('schoolId') schoolId: string,
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportReportExcel(schoolId, reportId);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="report-${reportId}-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    });
    res.send(buffer);
  }
}
