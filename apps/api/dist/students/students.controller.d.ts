import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
export declare class StudentsController {
    private studentsService;
    constructor(studentsService: StudentsService);
    create(schoolId: string, dto: CreateStudentDto): Promise<any>;
    findAll(schoolId: string, filters: FilterStudentsDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, schoolId: string): Promise<any>;
    attendanceSummary(id: string, schoolId: string): Promise<{
        total: any;
        present: any;
        absent: any;
        late: any;
        attendanceRate: string;
    }>;
    update(id: string, schoolId: string, dto: UpdateStudentDto): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<{
        message: string;
    }>;
}
