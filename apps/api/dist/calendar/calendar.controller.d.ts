import { CalendarEventType } from '@prisma/client';
import { CalendarService, CreateCalendarEventDto } from './calendar.service';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
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
    findAll(schoolId: string, from?: string, to?: string, type?: CalendarEventType): Promise<{
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
