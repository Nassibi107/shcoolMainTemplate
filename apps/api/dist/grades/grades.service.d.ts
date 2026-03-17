import { PrismaService } from '../prisma/prisma.service';
export interface UpsertGradeDto {
    studentId: string;
    subjectId: string;
    teacherId: string;
    term: string;
    score: number;
    maxScore?: number;
    letterGrade?: string;
    note?: string;
}
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertGrade(dto: UpsertGradeDto): Promise<{
        student: {
            user: {
                firstName: string;
                lastName: string;
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
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            employeeCode: string;
            qualification: string | null;
            specialization: string | null;
            hireDate: Date;
            salary: import("@prisma/client/runtime/library").Decimal;
        };
        subject: {
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        note: string | null;
        gradedAt: Date;
        subjectId: string;
        term: string;
        score: import("@prisma/client/runtime/library").Decimal;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        letterGrade: string | null;
    }>;
    bulkUpsert(grades: UpsertGradeDto[]): Promise<({
        student: {
            user: {
                firstName: string;
                lastName: string;
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
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            employeeCode: string;
            qualification: string | null;
            specialization: string | null;
            hireDate: Date;
            salary: import("@prisma/client/runtime/library").Decimal;
        };
        subject: {
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        note: string | null;
        gradedAt: Date;
        subjectId: string;
        term: string;
        score: import("@prisma/client/runtime/library").Decimal;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        letterGrade: string | null;
    })[]>;
    getStudentGrades(studentId: string, term?: string): Promise<({
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            employeeCode: string;
            qualification: string | null;
            specialization: string | null;
            hireDate: Date;
            salary: import("@prisma/client/runtime/library").Decimal;
        };
        subject: {
            name: string;
            code: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        note: string | null;
        gradedAt: Date;
        subjectId: string;
        term: string;
        score: import("@prisma/client/runtime/library").Decimal;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        letterGrade: string | null;
    })[]>;
    getClassGrades(classId: string, subjectId: string, term: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        teacherId: string;
        studentId: string;
        note: string | null;
        gradedAt: Date;
        subjectId: string;
        term: string;
        score: import("@prisma/client/runtime/library").Decimal;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        letterGrade: string | null;
    })[]>;
    getGradeDistribution(schoolId: string, term: string): Promise<{
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    }>;
}
