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
    getClassAttendance(classId: string, date: string, schoolId: string): Promise<{
        student: {
            user: {
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            dateOfBirth: Date | null;
            gender: string | null;
            parentId: string | null;
            studentCode: string;
            enrollmentDate: Date;
            userId: string;
        };
        attendance: {
            lessonId: string;
            record: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                status: import(".prisma/client").$Enums.AttendanceStatus;
                note: string | null;
                date: Date;
                lessonId: string;
                scheduleId: string | null;
            } | null;
        }[];
    }[]>;
    getStudentAttendance(studentId: string, filters: {
        from?: string;
        to?: string;
    }): Promise<({
        lesson: {
            subject: {
                name: string;
                code: string;
            };
            class: {
                name: string;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            classId: string;
            teacherId: string;
            subjectId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            room: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        note: string | null;
        date: Date;
        lessonId: string;
        scheduleId: string | null;
    })[]>;
    getDailyReport(schoolId: string, date: string): Promise<{
        date: string;
        total: number;
        present: number;
        absent: number;
        late: number;
    }>;
}
