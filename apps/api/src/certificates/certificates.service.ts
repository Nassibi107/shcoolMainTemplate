import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { CertificateType } from '@prisma/client';

export interface GenerateCertificateDto {
  studentId: string;
  type: CertificateType;
  templateId?: string;
  customBodyText?: string;
}

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {}

  async getTemplates(schoolId: string) {
    return this.prisma.certificateTemplate.findMany({
      where: { schoolId, deletedAt: null, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(schoolId: string, dto: { name: string; type: CertificateType; htmlContent: string }) {
    return this.prisma.certificateTemplate.create({
      data: { ...dto, schoolId },
    });
  }

  async updateTemplate(id: string, schoolId: string, dto: Partial<{ name: string; htmlContent: string; isActive: boolean }>) {
    const template = await this.prisma.certificateTemplate.findFirst({ where: { id, schoolId } });
    if (!template) throw new NotFoundException('Template not found');
    return this.prisma.certificateTemplate.update({ where: { id }, data: dto });
  }

  async generate(schoolId: string, dto: GenerateCertificateDto): Promise<Buffer> {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    if (!student) throw new NotFoundException('Student not found');

    const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) throw new NotFoundException('School not found');

    const bodyTexts: Record<string, string> = {
      REGISTRATION: 'is duly enrolled and registered as a student at this institution.',
      COMPLETION: 'has successfully completed the required academic program for this academic year.',
      DIPLOMA: 'has fulfilled all graduation requirements and is hereby awarded this diploma.',
      ATTENDANCE: 'has maintained an excellent attendance record throughout the academic year.',
      GRADUATION_REPORT: 'has completed all requirements and is recognized as a graduate of this institution.',
      CUSTOM: dto.customBodyText ?? '',
    };

    const html = this.pdfService.buildCertificateHtml({
      schoolName: school.name,
      schoolLogo: school.logoUrl ?? undefined,
      primaryColor: school.primaryColor,
      accentColor: school.accentColor,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      certificateType: dto.type.replace(/_/g, ' '),
      bodyText: bodyTexts[dto.type],
      issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    });

    const pdfBuffer = await this.pdfService.generateFromHtml(html);

    await this.prisma.certificate.create({
      data: {
        studentId: dto.studentId,
        templateId: dto.templateId ?? (await this.getOrCreateDefaultTemplate(schoolId, dto.type)).id,
        schoolId,
        type: dto.type,
        issuedAt: new Date(),
      },
    });

    return pdfBuffer;
  }

  async getStudentCertificates(studentId: string, schoolId: string) {
    return this.prisma.certificate.findMany({
      where: { studentId, schoolId },
      include: { template: { select: { name: true, type: true } } },
      orderBy: { issuedAt: 'desc' },
    });
  }

  private async getOrCreateDefaultTemplate(schoolId: string, type: CertificateType) {
    const existing = await this.prisma.certificateTemplate.findFirst({
      where: { schoolId, type, deletedAt: null },
    });

    if (existing) return existing;

    return this.prisma.certificateTemplate.create({
      data: {
        name: `Default ${type} Template`,
        type,
        htmlContent: '',
        schoolId,
      },
    });
  }
}
