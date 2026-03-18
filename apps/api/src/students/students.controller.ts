import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('students')
@ApiBearerAuth()
@Controller('schools/:schoolId/students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('my-children')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Get children for parent' })
  getMyChildren(@Param('schoolId') schoolId: string, @CurrentUser() user: JwtPayload) {
    return this.studentsService.findByParentId(user.sub, schoolId);
  }

  @Get('me')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get current student profile' })
  getMe(@Param('schoolId') schoolId: string, @CurrentUser() user: JwtPayload) {
    return this.studentsService.findByUserId(user.sub, schoolId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'Enroll a new student' })
  create(@Param('schoolId') schoolId: string, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(schoolId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  @ApiOperation({ summary: 'List students with filters and pagination' })
  findAll(@Param('schoolId') schoolId: string, @Query() filters: FilterStudentsDto) {
    return this.studentsService.findAll(schoolId, filters);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @ApiOperation({ summary: 'Get student details by ID' })
  findOne(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.studentsService.findOne(id, schoolId);
  }

  @Get(':id/attendance-summary')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @ApiOperation({ summary: 'Get attendance summary for a student' })
  attendanceSummary(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.studentsService.getAttendanceSummary(id, schoolId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'Update student information' })
  update(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, schoolId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete a student' })
  softDelete(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.studentsService.softDelete(id, schoolId);
  }
}
