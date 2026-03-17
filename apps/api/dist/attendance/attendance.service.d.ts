import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';
export interface MarkAttendanceDto {
    lessonId: string;
    date: string;
    records: Array<{
        studentId: string;
        status: AttendanceStatus;
        note?: string;
    }>;
}
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    markBulk(schoolId: string, dto: MarkAttendanceDto): Promise<{
        marked: number;
    }>;
    private checkConsecutiveAbsences;
    getClassAttendance(classId: string, date: string, schoolId: string): Promise<any>;
    getStudentAttendance(studentId: string, filters: {
        from?: string;
        to?: string;
    }): Promise<any>;
    getDailyReport(schoolId: string, date: string): Promise<{
        date: string;
        total: any;
        present: any;
        absent: any;
        late: any;
    }>;
}
