import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(schoolId: string): Promise<{
        totalStudents: any;
        activeTeachers: any;
        absencesToday: any;
        monthlyRevenue: number;
    }>;
    getAttendanceByClass(schoolId: string): Promise<any[]>;
    getAuditLogs(schoolId: string, limit?: string): Promise<any>;
}
