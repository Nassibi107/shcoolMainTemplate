import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role, DocumentRequestStatus } from '@prisma/client';
import { Response } from 'express';
import { DocumentRequestsService } from './document-requests.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ApproveRejectDocumentRequestDto } from './dto/approve-reject.dto';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('document-requests')
@ApiBearerAuth()
@Controller('schools/:schoolId/document-requests')
export class DocumentRequestsController {
  constructor(private documentRequestsService: DocumentRequestsService) {}

  @Post()
  @Roles(Role.PARENT, Role.STUDENT)
  create(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDocumentRequestDto,
  ) {
    return this.documentRequestsService.create(schoolId, user.sub, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  findAll(
    @Param('schoolId') schoolId: string,
    @Query('status') status?: DocumentRequestStatus,
  ) {
    return this.documentRequestsService.findAll(schoolId, { status });
  }

  @Get('my')
  @Roles(Role.PARENT, Role.STUDENT)
  findMy(@Param('schoolId') schoolId: string, @CurrentUser() user: JwtPayload) {
    return this.documentRequestsService.findForRequester(user.sub, schoolId);
  }

  @Get('pending-count')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getPendingCount(@Param('schoolId') schoolId: string) {
    return this.documentRequestsService.getPendingCount(schoolId);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  async approve(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ApproveRejectDocumentRequestDto,
  ) {
    return this.documentRequestsService.approve(id, schoolId, user.sub, dto);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  reject(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ApproveRejectDocumentRequestDto,
  ) {
    return this.documentRequestsService.reject(id, schoolId, user.sub, dto);
  }
}
