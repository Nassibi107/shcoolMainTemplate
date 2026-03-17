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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const filter_students_dto_1 = require("./dto/filter-students.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    create(schoolId, dto) {
        return this.studentsService.create(schoolId, dto);
    }
    findAll(schoolId, filters) {
        return this.studentsService.findAll(schoolId, filters);
    }
    findOne(id, schoolId) {
        return this.studentsService.findOne(id, schoolId);
    }
    attendanceSummary(id, schoolId) {
        return this.studentsService.getAttendanceSummary(id, schoolId);
    }
    update(id, schoolId, dto) {
        return this.studentsService.update(id, schoolId, dto);
    }
    softDelete(id, schoolId) {
        return this.studentsService.softDelete(id, schoolId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll a new student' }),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'List students with filters and pagination' }),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_students_dto_1.FilterStudentsDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER, client_1.Role.STUDENT, client_1.Role.PARENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get student details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/attendance-summary'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT, client_1.Role.TEACHER, client_1.Role.STUDENT, client_1.Role.PARENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance summary for a student' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "attendanceSummary", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.ASSISTANT),
    (0, swagger_1.ApiOperation)({ summary: 'Update student information' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a student' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "softDelete", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schools/:schoolId/students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map