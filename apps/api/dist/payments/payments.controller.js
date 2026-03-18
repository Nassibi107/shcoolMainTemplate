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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const payments_service_1 = require("./payments.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    create(schoolId, dto) {
        return this.paymentsService.create(schoolId, dto);
    }
    findAll(schoolId, status, studentId) {
        return this.paymentsService.findAll(schoolId, { status, studentId });
    }
    getFeeTypes(schoolId) {
        return this.paymentsService.getFeeTypes(schoolId);
    }
    getSummary(schoolId) {
        return this.paymentsService.getSummary(schoolId);
    }
    getMonthlyRevenue(schoolId) {
        return this.paymentsService.getMonthlyRevenue(schoolId);
    }
    async getMyPayments(schoolId, user, month) {
        const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
        if (!studentId)
            return [];
        return this.paymentsService.getByStudent(schoolId, studentId, month);
    }
    async exportMyPaymentsExcel(schoolId, user, month, res) {
        const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
        if (!studentId) {
            res.status(404).send('Student not found');
            return;
        }
        const buffer = await this.paymentsService.exportStudentPaymentsExcel(schoolId, studentId, month);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="my-payments-${month ?? 'all'}.xlsx"`,
        });
        res.send(buffer);
    }
    async exportMyPaymentsPdf(schoolId, user, month, res) {
        const studentId = await this.paymentsService.getStudentIdByUser(schoolId, user.sub);
        if (!studentId) {
            res.status(404).send('Student not found');
            return;
        }
        const buffer = await this.paymentsService.exportStudentPaymentsPdf(schoolId, studentId, month);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="my-payments-${month ?? 'all'}.pdf"`,
        });
        res.send(buffer);
    }
    getStudentPayments(schoolId, studentId, month) {
        return this.paymentsService.getByStudent(schoolId, studentId, month);
    }
    async exportExcel(schoolId, res) {
        const buffer = await this.paymentsService.exportToExcel(schoolId);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="payments.xlsx"',
        });
        res.send(buffer);
    }
    updateStatus(id, schoolId, dto) {
        return this.paymentsService.updateStatus(id, schoolId, dto);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('fee-types'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getFeeTypes", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('monthly-revenue'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getMonthlyRevenue", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMyPayments", null);
__decorate([
    (0, common_1.Get)('my/export/excel'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "exportMyPaymentsExcel", null);
__decorate([
    (0, common_1.Get)('my/export/pdf'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "exportMyPaymentsPdf", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.PARENT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getStudentPayments", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schools/:schoolId/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map