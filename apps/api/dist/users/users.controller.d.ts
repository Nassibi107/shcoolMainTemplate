import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(schoolId: string): Promise<{
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }[]>;
    findOne(id: string, schoolId: string): Promise<{
        school: {
            name: string;
            id: string;
        };
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    update(id: string, schoolId: string, dto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        isActive: boolean;
        updatedAt: Date;
    }>;
    softDelete(id: string, schoolId: string): Promise<{
        email: string;
        id: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        refreshTokenHash: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
