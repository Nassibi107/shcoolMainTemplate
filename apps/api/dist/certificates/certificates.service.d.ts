import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { CertificateType } from '@prisma/client';
export interface GenerateCertificateDto {
    studentId: string;
    type: CertificateType;
    templateId?: string;
    customBodyText?: string;
}
export declare class CertificatesService {
    private prisma;
    private pdfService;
    constructor(prisma: PrismaService, pdfService: PdfService);
    getTemplates(schoolId: string): Promise<any>;
    createTemplate(schoolId: string, dto: {
        name: string;
        type: CertificateType;
        htmlContent: string;
    }): Promise<any>;
    updateTemplate(id: string, schoolId: string, dto: Partial<{
        name: string;
        htmlContent: string;
        isActive: boolean;
    }>): Promise<any>;
    generate(schoolId: string, dto: GenerateCertificateDto): Promise<Buffer>;
    getStudentCertificates(studentId: string, schoolId: string): Promise<any>;
    private getOrCreateDefaultTemplate;
}
