import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TeachersService],
  controllers: [TeachersController],
  exports: [TeachersService],
})
export class TeachersModule {}
