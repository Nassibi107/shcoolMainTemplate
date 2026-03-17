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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const classes_service_1 = require("./classes.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ClassesController = class ClassesController {
    constructor(classesService) {
        this.classesService = classesService;
    }
    create(schoolId, dto) {
        return this.classesService.create(schoolId, dto);
    }
    findAll(schoolId) {
        return this.classesService.findAll(schoolId);
    }
    findOne(id, schoolId) {
        return this.classesService.findOne(id, schoolId);
    }
    update(id, schoolId, dto) {
        return this.classesService.update(id, schoolId, dto);
    }
    softDelete(id, schoolId) {
        return this.classesService.softDelete(id, schoolId);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "softDelete", null);
exports.ClassesController = ClassesController = __decorate([
    (0, swagger_1.ApiTags)('classes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schools/:schoolId/classes'),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map