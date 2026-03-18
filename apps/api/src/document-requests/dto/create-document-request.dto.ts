import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateDocumentRequestDto {
  @IsUUID()
  studentId: string;

  @IsString()
  documentType: string;

  @IsOptional()
  @IsString()
  note?: string;
}
