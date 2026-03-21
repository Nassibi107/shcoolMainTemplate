import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClassesService, CreateClassDto, CreateLessonDto, UpdateLessonDto } from './classes.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('schools/:schoolId/classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  create(@Param('schoolId') schoolId: string, @Body() dto: CreateClassDto) {
    return this.classesService.create(schoolId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  findAll(@Param('schoolId') schoolId: string) {
    return this.classesService.findAll(schoolId);
  }

  @Get('timetable')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getTimetable(@Param('schoolId') schoolId: string) {
    return this.classesService.getTimetable(schoolId);
  }

  @Get('timetable/options')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getTimetableOptions(@Param('schoolId') schoolId: string) {
    return this.classesService.getOptions(schoolId);
  }

  @Post('timetable/lessons')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  createLesson(@Param('schoolId') schoolId: string, @Body() dto: CreateLessonDto) {
    return this.classesService.createLesson(schoolId, dto);
  }

  @Patch('timetable/lessons/:lessonId')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  updateLesson(
    @Param('schoolId') schoolId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.classesService.updateLesson(schoolId, lessonId, dto);
  }

  @Get('timetable/teacher/me')
  @Roles(Role.TEACHER)
  getMyTimetable(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Query('classId') classId?: string,
  ) {
    return this.classesService.getTeacherScheduleByUser(schoolId, user.sub, classId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  findOne(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.classesService.findOne(id, schoolId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  update(@Param('id') id: string, @Param('schoolId') schoolId: string, @Body() dto: Partial<CreateClassDto>) {
    return this.classesService.update(id, schoolId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  softDelete(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.classesService.softDelete(id, schoolId);
  }
}
