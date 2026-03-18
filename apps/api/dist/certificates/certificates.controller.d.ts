import { CertificateType } from '@prisma/client';
import { Response } from 'express';
import { CertificatesService, GenerateCertificateDto } from './certificates.service';
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
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
    generate(schoolId: string, dto: GenerateCertificateDto, res: Response): Promise<void>;
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
    downloadById(id: string, schoolId: string, res: Response): Promise<void>;
}
