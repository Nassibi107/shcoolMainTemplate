import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('schools/:schoolId/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'List all users in school' })
  findAll(@Param('schoolId') schoolId: string) {
    return this.usersService.findAll(schoolId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.usersService.findOne(id, schoolId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, schoolId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete user' })
  softDelete(@Param('id') id: string, @Param('schoolId') schoolId: string) {
    return this.usersService.softDelete(id, schoolId);
  }
}
