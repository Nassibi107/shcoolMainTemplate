import { Controller, Get, Post, Patch, Body, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role, PaymentStatus } from '@prisma/client';
import { Response } from 'express';
import { PaymentsService, CreatePaymentDto, UpdatePaymentStatusDto } from './payments.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('schools/:schoolId/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  create(@Param('schoolId') schoolId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(schoolId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  findAll(
    @Param('schoolId') schoolId: string,
    @Query('status') status?: PaymentStatus,
    @Query('studentId') studentId?: string,
  ) {
    return this.paymentsService.findAll(schoolId, { status, studentId });
  }

  @Get('fee-types')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getFeeTypes(@Param('schoolId') schoolId: string) {
    return this.paymentsService.getFeeTypes(schoolId);
  }

  @Get('summary')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getSummary(@Param('schoolId') schoolId: string) {
    return this.paymentsService.getSummary(schoolId);
  }

  @Get('monthly-revenue')
  @Roles(Role.ADMIN)
  getMonthlyRevenue(@Param('schoolId') schoolId: string) {
    return this.paymentsService.getMonthlyRevenue(schoolId);
  }

  @Get('my')
  @Roles(Role.STUDENT)
  async getMyPayments(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Query('month') month?: string,
  ) {
    const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
    if (!studentId) return [];
    return this.paymentsService.getByStudent(schoolId, studentId, month);
  }

  @Get('my/export/excel')
  @Roles(Role.STUDENT)
  async exportMyPaymentsExcel(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Query('month') month: string | undefined,
    @Res() res: Response,
  ) {
    const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
    if (!studentId) {
      res.status(404).send('Student not found');
      return;
    }
    const buffer = await this.paymentsService.exportStudentPaymentsExcel(schoolId, studentId, month);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="my-payments-${month ?? 'all'}.xlsx"`,
    });
    res.send(buffer);
  }

  @Get('my/export/pdf')
  @Roles(Role.STUDENT)
  async exportMyPaymentsPdf(
    @Param('schoolId') schoolId: string,
    @CurrentUser() user: JwtPayload,
    @Query('month') month: string | undefined,
    @Res() res: Response,
  ) {
    const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
    if (!studentId) {
      res.status(404).send('Student not found');
      return;
    }
    const buffer = await this.paymentsService.exportStudentPaymentsPdf(schoolId, studentId, month);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="my-payments-${month ?? 'all'}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.PARENT)
  getStudentPayments(
    @Param('schoolId') schoolId: string,
    @Param('studentId') studentId: string,
    @Query('month') month?: string,
  ) {
    return this.paymentsService.getByStudent(schoolId, studentId, month);
  }

  @Get('export/excel')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  async exportExcel(@Param('schoolId') schoolId: string, @Res() res: Response) {
    const buffer = await this.paymentsService.exportToExcel(schoolId);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="payments.xlsx"',
    });
    res.send(buffer);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  updateStatus(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updateStatus(id, schoolId, dto);
  }
}
