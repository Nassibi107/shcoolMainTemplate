import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
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

  @Get('audit-logs')
  @Roles(Role.ADMIN)
  getAuditLogs(@Param('schoolId') schoolId: string, @Query('limit') limit?: string) {
    return this.reportsService.getRecentAuditLogs(schoolId, limit ? parseInt(limit) : 20);
  }
}
