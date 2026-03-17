import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<any>;
    findAll(schoolId: string): Promise<any>;
    findOne(id: string, schoolId: string): Promise<any>;
    update(id: string, schoolId: string, dto: UpdateUserDto): Promise<any>;
    softDelete(id: string, schoolId: string): Promise<any>;
}
