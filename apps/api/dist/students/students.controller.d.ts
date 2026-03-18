import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class StudentsController {
    private studentsService;
    constructor(studentsService: StudentsService);
    getMyChildren(schoolId: string, user: JwtPayload): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        classEnrollments: ({
            class: {
                name: string;
                id: string;
                code: string;
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
    })[]>;
    getMe(schoolId: string, user: JwtPayload): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        classEnrollments: ({
            class: {
                name: string;
                id: string;
                code: string;
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
    }) | null>;
    create(schoolId: string, dto: CreateStudentDto): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
        };
        parent: ({
            user: {
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            userId: string;
            occupation: string | null;
        }) | null;
        classEnrollments: ({
            class: {
                name: string;
                id: string;
                code: string;
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
    }>;
    findAll(schoolId: string, filters: FilterStudentsDto): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                avatarUrl: string | null;
                isActive: boolean;
            };
            payments: {
                amount: import("@prisma/client/runtime/library").Decimal;
                status: import(".prisma/client").$Enums.PaymentStatus;
            }[];
            classEnrollments: ({
                class: {
                    name: string;
                    id: string;
                    code: string;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, schoolId: string): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        };
        parent: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            userId: string;
            occupation: string | null;
        }) | null;
        payments: ({
            feeType: {
                name: string;
                category: import(".prisma/client").$Enums.FeeCategory;
            };
        } & {
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentId: string;
            feeTypeId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.PaymentStatus;
            dueDate: Date;
            paidAt: Date | null;
            reference: string | null;
            note: string | null;
        })[];
        classEnrollments: ({
            class: {
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
                name: string;
                id: string;
                code: string;
                academicYear: string;
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
        attendances: ({
            lesson: {
                subject: {
                    name: string;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            note: string | null;
            date: Date;
            lessonId: string;
            scheduleId: string | null;
        })[];
        grades: ({
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
        })[];
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
    }>;
    attendanceSummary(id: string, schoolId: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        attendanceRate: string;
    }>;
    update(id: string, schoolId: string, dto: UpdateStudentDto): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        };
        parent: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            userId: string;
            occupation: string | null;
        }) | null;
        payments: ({
            feeType: {
                name: string;
                category: import(".prisma/client").$Enums.FeeCategory;
            };
        } & {
            id: string;
            schoolId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentId: string;
            feeTypeId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.PaymentStatus;
            dueDate: Date;
            paidAt: Date | null;
            reference: string | null;
            note: string | null;
        })[];
        classEnrollments: ({
            class: {
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
                name: string;
                id: string;
                code: string;
                academicYear: string;
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
        attendances: ({
            lesson: {
                subject: {
                    name: string;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            note: string | null;
            date: Date;
            lessonId: string;
            scheduleId: string | null;
        })[];
        grades: ({
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
        })[];
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
    }>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
