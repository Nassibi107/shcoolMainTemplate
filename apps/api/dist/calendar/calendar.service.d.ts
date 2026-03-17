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
    create(schoolId: string, dto: CreateCalendarEventDto): Promise<{
        type: import(".prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        color: string | null;
        startDate: Date;
        endDate: Date;
        allDay: boolean;
    }>;
    findAll(schoolId: string, filters: {
        from?: string;
        to?: string;
        type?: CalendarEventType;
    }): Promise<{
        type: import(".prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        color: string | null;
        startDate: Date;
        endDate: Date;
        allDay: boolean;
    }[]>;
    update(id: string, schoolId: string, dto: Partial<CreateCalendarEventDto>): Promise<{
        type: import(".prisma/client").$Enums.CalendarEventType;
        description: string | null;
        title: string;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        color: string | null;
        startDate: Date;
        endDate: Date;
        allDay: boolean;
    }>;
    remove(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
