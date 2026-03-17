import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
export interface CreateTeacherDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    qualification?: string;
    specialization?: string;
    salary?: number;
}
export interface UpdateTeacherDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    qualification?: string;
    specialization?: string;
    salary?: number;
    isActive?: boolean;
}
export declare class TeachersService {
    private prisma;
    private authService;
    constructor(prisma: PrismaService, authService: AuthService);
    create(schoolId: string, dto: CreateTeacherDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: UpdateTeacherDto): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
    getSchedule(id: string, schoolId: string): Promise<any>;
}
