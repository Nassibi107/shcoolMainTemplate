import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradesModule } from './grades/grades.module';
import { PaymentsModule } from './payments/payments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CalendarModule } from './calendar/calendar.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    AttendanceModule,
    GradesModule,
    PaymentsModule,
    CertificatesModule,
    CalendarModule,
    NotificationsModule,
    ReportsModule,
  ],
})
export class AppModule {}
