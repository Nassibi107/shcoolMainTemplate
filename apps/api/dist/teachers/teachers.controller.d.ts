import { TeachersService, CreateTeacherDto, UpdateTeacherDto } from './teachers.service';
export declare class TeachersController {
    private teachersService;
    constructor(teachersService: TeachersService);
    create(schoolId: string, dto: CreateTeacherDto): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        classes: {
            name: string;
            id: string;
            code: string;
        }[];
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
    }>;
    findAll(schoolId: string): Promise<({
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            isActive: boolean;
        };
        _count: {
            grades: number;
            lessons: number;
        };
        classes: {
            name: string;
            id: string;
            code: string;
        }[];
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
    })[]>;
    findOne(id: string, schoolId: string): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
        };
        classes: {
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
        }[];
        lessons: ({
            subject: {
                name: string;
                code: string;
            };
            class: {
                name: string;
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
        salaryPayments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SalaryStatus;
            paidAt: Date | null;
            note: string | null;
            month: string;
        }[];
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
    }>;
    getSchedule(id: string, schoolId: string): Promise<({
        subject: {
            name: string;
            code: string;
            color: string;
        };
        class: {
            name: string;
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
    })[]>;
    update(id: string, schoolId: string, dto: UpdateTeacherDto): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
        };
        classes: {
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
        }[];
        lessons: ({
            subject: {
                name: string;
                code: string;
            };
            class: {
                name: string;
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
        salaryPayments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            teacherId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.SalaryStatus;
            paidAt: Date | null;
            note: string | null;
            month: string;
        }[];
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
    }>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
