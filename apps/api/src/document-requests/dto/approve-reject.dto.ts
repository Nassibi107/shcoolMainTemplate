import { IsString, IsOptional } from 'class-validator';

export class ApproveRejectDocumentRequestDto {
  @IsOptional()
  @IsString()
  note?: string;
}
