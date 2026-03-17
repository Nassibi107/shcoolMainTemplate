import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClassesService, CreateClassDto } from './classes.service';
import { Roles } from '../common/decorators/roles.decorator';

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
