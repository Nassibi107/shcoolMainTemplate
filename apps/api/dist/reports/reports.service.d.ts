import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(schoolId: string): Promise<{
        totalStudents: any;
        activeTeachers: any;
        absencesToday: any;
        monthlyRevenue: number;
    }>;
    getAttendanceRateByClass(schoolId: string): Promise<any[]>;
    getRecentAuditLogs(schoolId: string, limit?: number): Promise<any>;
}
