import { TeachersService, CreateTeacherDto, UpdateTeacherDto } from './teachers.service';
export declare class TeachersController {
    private teachersService;
    constructor(teachersService: TeachersService);
    create(schoolId: string, dto: CreateTeacherDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    getSchedule(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: UpdateTeacherDto): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
