import { Controller, Get, Post, Patch, Body, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role, CertificateType } from '@prisma/client';
import { Response } from 'express';
import { CertificatesService, GenerateCertificateDto } from './certificates.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('certificates')
@ApiBearerAuth()
@Controller('schools/:schoolId/certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get('templates')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  getTemplates(@Param('schoolId') schoolId: string) {
    return this.certificatesService.getTemplates(schoolId);
  }

  @Post('templates')
  @Roles(Role.ADMIN)
  createTemplate(
    @Param('schoolId') schoolId: string,
    @Body() dto: { name: string; type: CertificateType; htmlContent: string },
  ) {
    return this.certificatesService.createTemplate(schoolId, dto);
  }

  @Patch('templates/:id')
  @Roles(Role.ADMIN)
  updateTemplate(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @Body() dto: Partial<{ name: string; htmlContent: string; isActive: boolean }>,
  ) {
    return this.certificatesService.updateTemplate(id, schoolId, dto);
  }

  @Post('generate')
  @Roles(Role.ADMIN, Role.ASSISTANT)
  async generate(
    @Param('schoolId') schoolId: string,
    @Body() dto: GenerateCertificateDto,
    @Res() res: Response,
  ) {
    const buffer = await this.certificatesService.generate(schoolId, dto);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${dto.type}-${dto.studentId}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.STUDENT, Role.PARENT)
  getStudentCertificates(@Param('studentId') studentId: string, @Param('schoolId') schoolId: string) {
    return this.certificatesService.getStudentCertificates(studentId, schoolId);
  }

  @Get('download/:id')
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.STUDENT, Role.PARENT)
  async downloadById(
    @Param('id') id: string,
    @Param('schoolId') schoolId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.certificatesService.generatePdfById(id, schoolId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`,
    });
    res.send(buffer);
  }
}
