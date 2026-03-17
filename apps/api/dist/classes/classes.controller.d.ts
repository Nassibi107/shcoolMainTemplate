import { ClassesService, CreateClassDto } from './classes.service';
export declare class ClassesController {
    private classesService;
    constructor(classesService: ClassesService);
    create(schoolId: string, dto: CreateClassDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: Partial<CreateClassDto>): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
