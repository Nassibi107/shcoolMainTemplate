"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const classes_module_1 = require("./classes/classes.module");
const attendance_module_1 = require("./attendance/attendance.module");
const grades_module_1 = require("./grades/grades.module");
const payments_module_1 = require("./payments/payments.module");
const certificates_module_1 = require("./certificates/certificates.module");
const calendar_module_1 = require("./calendar/calendar.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const document_requests_module_1 = require("./document-requests/document-requests.module");
const leaves_module_1 = require("./leaves/leaves.module");
const app_config_1 = require("./config/app.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            classes_module_1.ClassesModule,
            attendance_module_1.AttendanceModule,
            grades_module_1.GradesModule,
            payments_module_1.PaymentsModule,
            certificates_module_1.CertificatesModule,
            calendar_module_1.CalendarModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            document_requests_module_1.DocumentRequestsModule,
            leaves_module_1.LeavesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map