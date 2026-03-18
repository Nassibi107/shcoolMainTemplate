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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const certificates_service_1 = require("./certificates.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let CertificatesController = class CertificatesController {
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    getTemplates(schoolId) {
        return this.certificatesService.getTemplates(schoolId);
    }
    createTemplate(schoolId, dto) {
        return this.certificatesService.createTemplate(schoolId, dto);
    }
    updateTemplate(id, schoolId, dto) {
        return this.certificatesService.updateTemplate(id, schoolId, dto);
    }
    async generate(schoolId, dto, res) {
        const buffer = await this.certificatesService.generate(schoolId, dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate-${dto.type}-${dto.studentId}.pdf"`,
        });
        res.send(buffer);
    }
    getStudentCertificates(studentId, schoolId) {
        return this.certificatesService.getStudentCertificates(studentId, schoolId);
    }
    async downloadById(id, schoolId, res) {
        const buffer = await this.certificatesService.generatePdfById(id, schoolId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`,
        });
        res.send(buffer);
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.STUDENT, client_1.Role.PARENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "getStudentCertificates", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.STUDENT, client_1.Role.PARENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "downloadById", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, swagger_1.ApiTags)('certificates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schools/:schoolId/certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map