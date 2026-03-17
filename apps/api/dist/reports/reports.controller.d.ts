import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(schoolId: string): Promise<{
        totalStudents: number;
        activeTeachers: number;
        absencesToday: number;
        monthlyRevenue: number;
    }>;
    getAttendanceByClass(schoolId: string): Promise<({
        className: string;
        rate: number;
        classId?: undefined;
        totalStudents?: undefined;
    } | {
        classId: string;
        className: string;
        rate: number;
        totalStudents: number;
    })[]>;
    getAuditLogs(schoolId: string, limit?: string): Promise<({
        user: {
            role: import(".prisma/client").$Enums.Role;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        userId: string;
        action: import(".prisma/client").$Enums.AuditAction;
        entity: string;
        entityId: string;
        changes: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
}
