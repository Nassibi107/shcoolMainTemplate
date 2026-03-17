import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarEventType } from '@prisma/client';

export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  type: CalendarEventType;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  color?: string;
}

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateCalendarEventDto) {
    return this.prisma.calendarEvent.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        schoolId,
      },
    });
  }

  async findAll(schoolId: string, filters: { from?: string; to?: string; type?: CalendarEventType }) {
    const where: any = { schoolId, deletedAt: null };
    if (filters.type) where.type = filters.type;
    if (filters.from || filters.to) {
      where.startDate = {};
      if (filters.from) where.startDate.gte = new Date(filters.from);
      if (filters.to) where.startDate.lte = new Date(filters.to);
    }

    return this.prisma.calendarEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
  }

  async update(id: string, schoolId: string, dto: Partial<CreateCalendarEventDto>) {
    const event = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
    if (!event) throw new NotFoundException('Event not found');

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      },
    });
  }

  async remove(id: string, schoolId: string) {
    const event = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
    if (!event) throw new NotFoundException('Event not found');
    await this.prisma.calendarEvent.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Event removed' };
  }
}
