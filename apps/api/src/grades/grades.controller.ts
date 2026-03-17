import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GradesService, UpsertGradeDto } from './grades.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('grades')
@ApiBearerAuth()
@Controller('schools/:schoolId/grades')
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  upsertGrade(@Body() dto: UpsertGradeDto) {
    return this.gradesService.upsertGrade(dto);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.TEACHER)
  bulkUpsert(@Body() body: { grades: UpsertGradeDto[] }) {
    return this.gradesService.bulkUpsert(body.grades);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentGrades(@Param('studentId') studentId: string, @Query('term') term?: string) {
    return this.gradesService.getStudentGrades(studentId, term);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  getClassGrades(
    @Param('classId') classId: string,
    @Query('subjectId') subjectId: string,
    @Query('term') term: string,
  ) {
    return this.gradesService.getClassGrades(classId, subjectId, term);
  }

  @Get('distribution')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getDistribution(@Param('schoolId') schoolId: string, @Query('term') term: string) {
    return this.gradesService.getGradeDistribution(schoolId, term);
  }
}
