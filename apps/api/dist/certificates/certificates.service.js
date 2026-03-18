"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdf_service_1 = require("./pdf.service");
let CertificatesService = class CertificatesService {
    constructor(prisma, pdfService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
    }
    async getTemplates(schoolId) {
        return this.prisma.certificateTemplate.findMany({
            where: { schoolId, deletedAt: null, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTemplate(schoolId, dto) {
        return this.prisma.certificateTemplate.create({
            data: { ...dto, schoolId },
        });
    }
    async updateTemplate(id, schoolId, dto) {
        const template = await this.prisma.certificateTemplate.findFirst({ where: { id, schoolId } });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return this.prisma.certificateTemplate.update({ where: { id }, data: dto });
    }
    async generate(schoolId, dto) {
        const student = await this.prisma.student.findFirst({
            where: { id: dto.studentId, schoolId },
            include: { user: { select: { firstName: true, lastName: true } } },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
        if (!school)
            throw new common_1.NotFoundException('School not found');
        const bodyTexts = {
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
    async generatePdfById(certificateId, schoolId) {
        const certificate = await this.prisma.certificate.findFirst({
            where: { id: certificateId, schoolId },
            include: {
                student: { include: { user: { select: { firstName: true, lastName: true } } } },
                template: true,
            },
        });
        if (!certificate)
            throw new common_1.NotFoundException('Certificate not found');
        const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
        if (!school)
            throw new common_1.NotFoundException('School not found');
        const bodyTexts = {
            REGISTRATION: 'is duly enrolled and registered as a student at this institution.',
            COMPLETION: 'has successfully completed the required academic program for this academic year.',
            DIPLOMA: 'has fulfilled all graduation requirements and is hereby awarded this diploma.',
            ATTENDANCE: 'has maintained an excellent attendance record throughout the academic year.',
            GRADUATION_REPORT: 'has completed all requirements and is recognized as a graduate of this institution.',
            CUSTOM: '',
        };
        const html = this.pdfService.buildCertificateHtml({
            schoolName: school.name,
            schoolLogo: school.logoUrl ?? undefined,
            primaryColor: school.primaryColor,
            accentColor: school.accentColor,
            studentName: `${certificate.student.user.firstName} ${certificate.student.user.lastName}`,
            certificateType: certificate.type.replace(/_/g, ' '),
            bodyText: bodyTexts[certificate.type] ?? '',
            issuedDate: new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });
        return this.pdfService.generateFromHtml(html);
    }
    async getStudentCertificates(studentId, schoolId) {
        return this.prisma.certificate.findMany({
            where: { studentId, schoolId },
            include: { template: { select: { name: true, type: true } } },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async getOrCreateDefaultTemplate(schoolId, type) {
        const existing = await this.prisma.certificateTemplate.findFirst({
            where: { schoolId, type, deletedAt: null },
        });
        if (existing)
            return existing;
        return this.prisma.certificateTemplate.create({
            data: {
                name: `Default ${type} Template`,
                type,
                htmlContent: '',
                schoolId,
            },
        });
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map