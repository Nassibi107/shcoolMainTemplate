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
    upsertGrade(dto: UpsertGradeDto): Promise<any>;
    bulkUpsert(grades: UpsertGradeDto[]): Promise<any[]>;
    getStudentGrades(studentId: string, term?: string): Promise<any>;
    getClassGrades(classId: string, subjectId: string, term: string): Promise<any>;
    getGradeDistribution(schoolId: string, term: string): Promise<{
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    }>;
}
