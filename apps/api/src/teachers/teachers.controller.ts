import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { TeachersService, CreateTeacherDto, UpdateTeacherDto } from './teachers.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('teachers')
@ApiBearerAuth()
@Controller('schools/:schoolId/teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'Register a new teacher' })
  create(@Param('schoolId') schoolId: string, @Body() dto: CreateTeacherDto) {
    return this.teachersService.create(schoolId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'List all teachers' })
  findAll(@Param('schoolId') schoolId: string) {
    return this.teachersService.findAll(schoolId);
  }

  // IMPORTANT: me/schedule must come BEFORE :id and :id/schedule
  // so NestJS does not treat "me" as a dynamic :id param.
  @Get('me/schedule')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get current teacher weekly schedule' })
  getMySchedule(@Param('schoolId') schoolId: string, @CurrentUser() user: JwtPayload) {
    return this.teachersService.getMySchedule(user.sub, schoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher by ID' })
  findOne(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.teachersService.findOne(id, schoolId);
  }

  @Get(':id/schedule')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher weekly schedule by ID' })
  getSchedule(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.teachersService.getSchedule(id, schoolId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'Update teacher' })
  update(@Param('id') id: string, @Param('schoolId') schoolId: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, schoolId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete teacher' })
  softDelete(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.teachersService.softDelete(id, schoolId);
  }
}
