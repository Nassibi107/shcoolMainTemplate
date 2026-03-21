import { PrismaService } from '../prisma/prisma.service';
export interface CreateClassDto {
    name: string;
    code: string;
    level?: string;
    capacity?: number;
    academicYear: string;
    teacherId?: string;
}
export interface CreateLessonDto {
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
}
export interface UpdateLessonDto {
    classId?: string;
    subjectId?: string;
    teacherId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    room?: string;
}
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, dto: CreateClassDto): Promise<{
        teacher: ({
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
        }) | null;
        _count: {
            enrollments: number;
            lessons: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        level: string | null;
        capacity: number;
        academicYear: string;
        teacherId: string | null;
    }>;
    findAll(schoolId: string): Promise<({
        teacher: ({
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
        }) | null;
        _count: {
            enrollments: number;
            lessons: number;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        level: string | null;
        capacity: number;
        academicYear: string;
        teacherId: string | null;
    })[]>;
    findOne(id: string, schoolId: string): Promise<{
        teacher: ({
            user: {
                email: string;
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
        }) | null;
        enrollments: ({
            student: {
                user: {
                    email: string;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            enrolledAt: Date;
            leftAt: Date | null;
            studentId: string;
        })[];
        lessons: ({
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
        })[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        level: string | null;
        capacity: number;
        academicYear: string;
        teacherId: string | null;
    }>;
    update(id: string, schoolId: string, dto: Partial<CreateClassDto>): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        level: string | null;
        capacity: number;
        academicYear: string;
        teacherId: string | null;
    }>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
    getTimetable(schoolId: string): Promise<{
        lessons: ({
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
                id: string;
                code: string;
                color: string;
            };
            class: {
                name: string;
                id: string;
                code: string;
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
        })[];
    }>;
    getOptions(schoolId: string): Promise<{
        classes: {
            name: string;
            id: string;
            code: string;
        }[];
        teachers: ({
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
        })[];
        subjects: {
            name: string;
            id: string;
            code: string;
            color: string;
        }[];
    }>;
    createLesson(schoolId: string, dto: CreateLessonDto): Promise<{
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
            id: string;
            code: string;
            color: string;
        };
        class: {
            name: string;
            id: string;
            code: string;
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
    }>;
    updateLesson(schoolId: string, lessonId: string, dto: UpdateLessonDto): Promise<{
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
            id: string;
            code: string;
            color: string;
        };
        class: {
            name: string;
            id: string;
            code: string;
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
    }>;
    getTeacherScheduleByUser(schoolId: string, userId: string, classId?: string): Promise<{
        teacherId: string;
        classes: {
            name: string;
            id: string;
            code: string;
        }[];
        lessons: ({
            subject: {
                name: string;
                id: string;
                code: string;
                color: string;
            };
            class: {
                name: string;
                id: string;
                code: string;
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
        })[];
    }>;
}
