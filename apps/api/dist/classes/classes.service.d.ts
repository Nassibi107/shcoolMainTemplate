import { PrismaService } from '../prisma/prisma.service';
export interface CreateClassDto {
    name: string;
    code: string;
    level?: string;
    capacity?: number;
    academicYear: string;
    teacherId?: string;
}
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(schoolId: string, dto: CreateClassDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: Partial<CreateClassDto>): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
