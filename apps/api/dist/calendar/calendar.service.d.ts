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
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, dto: CreateCalendarEventDto): Promise<any>;
    findAll(schoolId: string, filters: {
        from?: string;
        to?: string;
        type?: CalendarEventType;
    }): Promise<any>;
    update(id: string, schoolId: string, dto: Partial<CreateCalendarEventDto>): Promise<any>;
    remove(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
