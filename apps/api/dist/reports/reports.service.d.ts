import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../certificates/pdf.service';
export declare class ReportsService {
    private prisma;
    private pdfService;
    constructor(prisma: PrismaService, pdfService: PdfService);
    getDashboardStats(schoolId: string): Promise<{
        totalStudents: number;
        activeTeachers: number;
        parentCount: number;
        absencesToday: number;
        monthlyRevenue: number;
    }>;
    getAttendanceRateByClass(schoolId: string): Promise<({
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
    getRecentAuditLogs(schoolId: string, limit?: number): Promise<({
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
    getMonthlyRevenue(schoolId: string): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getGradeDistribution(schoolId: string): Promise<{
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    }>;
    exportReportPdf(schoolId: string, reportId: string): Promise<Buffer>;
    exportReportExcel(schoolId: string, reportId: string): Promise<Buffer>;
}
