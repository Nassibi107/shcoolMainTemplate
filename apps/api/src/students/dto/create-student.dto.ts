import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  classId?: string;
}
