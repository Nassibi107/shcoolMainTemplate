import { AttendanceService, MarkAttendanceDto } from './attendance.service';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    markBulk(schoolId: string, dto: MarkAttendanceDto): Promise<{
        marked: number;
    }>;
    getClassAttendance(classId: string, schoolId: string, date: string): Promise<any>;
    getStudentAttendance(studentId: string, from?: string, to?: string): Promise<any>;
    getDailyReport(schoolId: string, date: string): Promise<{
        date: string;
        total: any;
        present: any;
        absent: any;
        late: any;
    }>;
}
