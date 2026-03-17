import { CalendarEventType } from '@prisma/client';
import { CalendarService, CreateCalendarEventDto } from './calendar.service';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    create(schoolId: string, dto: CreateCalendarEventDto): Promise<any>;
    findAll(schoolId: string, from?: string, to?: string, type?: CalendarEventType): Promise<any>;
    update(id: string, schoolId: string, dto: Partial<CreateCalendarEventDto>): Promise<any>;
    remove(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
