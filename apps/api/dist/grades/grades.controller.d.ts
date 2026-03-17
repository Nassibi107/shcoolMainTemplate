import { GradesService, UpsertGradeDto } from './grades.service';
export declare class GradesController {
    private gradesService;
    constructor(gradesService: GradesService);
    upsertGrade(dto: UpsertGradeDto): Promise<any>;
    bulkUpsert(body: {
        grades: UpsertGradeDto[];
    }): Promise<any[]>;
    getStudentGrades(studentId: string, term?: string): Promise<any>;
    getClassGrades(classId: string, subjectId: string, term: string): Promise<any>;
    getDistribution(schoolId: string, term: string): Promise<{
        A: number;
        B: number;
        C: number;
        D: number;
        F: number;
    }>;
}
