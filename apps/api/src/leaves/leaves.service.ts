import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateLeaveRequestDto {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ReviewLeaveRequestDto {
  note?: string;
}

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async createForTeacher(schoolId: string, userId: string, dto: CreateLeaveRequestDto) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { schoolId, userId, deletedAt: null, isActive: true },
      select: { id: true },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
      throw new BadRequestException('Invalid leave dates');
    }

    return this.prisma.leaveRequest.create({
      data: {
        requesterId: userId,
        teacherId: teacher.id,
        startDate,
        endDate,
        reason: `[${dto.type}] ${dto.reason}`,
        status: LeaveStatus.PENDING,
      },
    });
  }

  async listTeacherRequests(schoolId: string, userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { schoolId, userId, deletedAt: null, isActive: true },
      select: { id: true },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    return this.prisma.leaveRequest.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listForManagement(schoolId: string, status?: LeaveStatus) {
    return this.prisma.leaveRequest.findMany({
      where: {
        teacher: { schoolId },
        ...(status ? { status } : {}),
      },
      include: {
        teacher: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        approver: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: string, schoolId: string, approverId: string, dto: ReviewLeaveRequestDto) {
    const leave = await this.prisma.leaveRequest.findFirst({
      where: { id, teacher: { schoolId } },
      select: { id: true, status: true },
    });
    if (!leave) throw new NotFoundException('Leave request not found');
    if (leave.status !== LeaveStatus.PENDING) throw new ForbiddenException('Request is no longer pending');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.APPROVED,
        approverId,
        note: dto.note,
      },
    });
  }

  async reject(id: string, schoolId: string, approverId: string, dto: ReviewLeaveRequestDto) {
    const leave = await this.prisma.leaveRequest.findFirst({
      where: { id, teacher: { schoolId } },
      select: { id: true, status: true },
    });
    if (!leave) throw new NotFoundException('Leave request not found');
    if (leave.status !== LeaveStatus.PENDING) throw new ForbiddenException('Request is no longer pending');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.REJECTED,
        approverId,
        note: dto.note,
      },
    });
  }
}
