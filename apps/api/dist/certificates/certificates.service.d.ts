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
    getTemplates(schoolId: string): Promise<{
        name: string;
        type: import(".prisma/client").$Enums.CertificateType;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        htmlContent: string;
    }[]>;
    createTemplate(schoolId: string, dto: {
        name: string;
        type: CertificateType;
        htmlContent: string;
    }): Promise<{
        name: string;
        type: import(".prisma/client").$Enums.CertificateType;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        htmlContent: string;
    }>;
    updateTemplate(id: string, schoolId: string, dto: Partial<{
        name: string;
        htmlContent: string;
        isActive: boolean;
    }>): Promise<{
        name: string;
        type: import(".prisma/client").$Enums.CertificateType;
        id: string;
        isActive: boolean;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        htmlContent: string;
    }>;
    generate(schoolId: string, dto: GenerateCertificateDto): Promise<Buffer>;
    getStudentCertificates(studentId: string, schoolId: string): Promise<({
        template: {
            name: string;
            type: import(".prisma/client").$Enums.CertificateType;
        };
    } & {
        type: import(".prisma/client").$Enums.CertificateType;
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        pdfUrl: string | null;
        issuedAt: Date;
        templateId: string;
    })[]>;
    private getOrCreateDefaultTemplate;
}
