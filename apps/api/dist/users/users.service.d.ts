import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    private authService;
    constructor(prisma: PrismaService, authService: AuthService);
    create(dto: CreateUserDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: UpdateUserDto): Promise<any>;
    deactivate(id: string, schoolId: string): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<any>;
}
