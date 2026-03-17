import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AttendanceService, MarkAttendanceDto } from './attendance.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('schools/:schoolId/attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('mark')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  markBulk(@Param('schoolId') schoolId: string, @Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markBulk(schoolId, dto);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  getClassAttendance(
    @Param('classId') classId: string,
    @Param('schoolId') schoolId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getClassAttendance(classId, date, schoolId);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, { from, to });
  }

  @Get('daily-report')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getDailyReport(@Param('schoolId') schoolId: string, @Query('date') date: string) {
    return this.attendanceService.getDailyReport(schoolId, date);
  }
}
