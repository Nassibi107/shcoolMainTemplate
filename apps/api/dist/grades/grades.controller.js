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
exports.GradesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const grades_service_1 = require("./grades.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let GradesController = class GradesController {
    constructor(gradesService) {
        this.gradesService = gradesService;
    }
    upsertGrade(dto) {
        return this.gradesService.upsertGrade(dto);
    }
    bulkUpsert(body) {
        return this.gradesService.bulkUpsert(body.grades);
    }
    getStudentGrades(studentId, term) {
        return this.gradesService.getStudentGrades(studentId, term);
    }
    getClassGrades(classId, subjectId, term) {
        return this.gradesService.getClassGrades(classId, subjectId, term);
    }
    getDistribution(schoolId, term) {
        return this.gradesService.getGradeDistribution(schoolId, term);
    }
};
exports.GradesController = GradesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GradesController.prototype, "upsertGrade", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GradesController.prototype, "bulkUpsert", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER, client_1.Role.STUDENT, client_1.Role.PARENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GradesController.prototype, "getStudentGrades", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('subjectId')),
    __param(2, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GradesController.prototype, "getClassGrades", null);
__decorate([
    (0, common_1.Get)('distribution'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GradesController.prototype, "getDistribution", null);
exports.GradesController = GradesController = __decorate([
    (0, swagger_1.ApiTags)('grades'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schools/:schoolId/grades'),
    __metadata("design:paramtypes", [grades_service_1.GradesService])
], GradesController);
//# sourceMappingURL=grades.controller.js.map