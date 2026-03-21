import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeaveStatus, Role } from '@prisma/client';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateLeaveRequestDto, LeavesService, ReviewLeaveRequestDto } from './leaves.service';

@ApiTags('leaves')
@ApiBearerAuth()
@Controller('schools/:schoolId/leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  @Roles(Role.TEACHER)
  createTeacherLeave(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.leavesService.createForTeacher(schoolId, user.sub, dto);
  }

  @Get('my')
  @Roles(Role.TEACHER)
  myLeaves(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.leavesService.listTeacherRequests(schoolId, user.sub);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  listForManagement(@Param('schoolId') schoolId: string, @Query('status') status?: LeaveStatus) {
    return this.leavesService.listForManagement(schoolId, status);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  approve(
    @Param('schoolId') schoolId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ReviewLeaveRequestDto,
  ) {
    return this.leavesService.approve(id, schoolId, user.sub, dto);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  reject(
    @Param('schoolId') schoolId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ReviewLeaveRequestDto,
  ) {
    return this.leavesService.reject(id, schoolId, user.sub, dto);
  }
}
