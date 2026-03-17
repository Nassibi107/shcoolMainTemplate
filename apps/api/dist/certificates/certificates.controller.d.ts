import { CertificateType } from '@prisma/client';
import { Response } from 'express';
import { CertificatesService, GenerateCertificateDto } from './certificates.service';
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
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
    generate(schoolId: string, dto: GenerateCertificateDto, res: Response): Promise<void>;
    getStudentCertificates(studentId: string, schoolId: string): Promise<any>;
}
