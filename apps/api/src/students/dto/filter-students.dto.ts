import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterStudentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'PAID', 'OVERDUE'] })
  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'OVERDUE'])
  paymentStatus?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
