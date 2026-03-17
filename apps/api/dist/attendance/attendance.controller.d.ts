import { AttendanceService, MarkAttendanceDto } from './attendance.service';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    markBulk(schoolId: string, dto: MarkAttendanceDto): Promise<{
        marked: number;
    }>;
    getClassAttendance(classId: string, schoolId: string, date: string): Promise<{
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
    getStudentAttendance(studentId: string, from?: string, to?: string): Promise<({
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
