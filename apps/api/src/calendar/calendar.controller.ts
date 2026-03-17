import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role, CalendarEventType } from '@prisma/client';
import { CalendarService, CreateCalendarEventDto } from './calendar.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('calendar')
@ApiBearerAuth()
@Controller('schools/:schoolId/calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  create(@Param('schoolId') schoolId: string, @Body() dto: CreateCalendarEventDto) {
    return this.calendarService.create(schoolId, dto);
  }

  @Get()
  findAll(
    @Param('schoolId') schoolId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: CalendarEventType,
  ) {
    return this.calendarService.findAll(schoolId, { from, to, type });
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  update(@Param('id') id: string, @Param('schoolId') schoolId: string, @Body() dto: Partial<CreateCalendarEventDto>) {
    return this.calendarService.update(id, schoolId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.calendarService.remove(id, schoolId);
  }
}
