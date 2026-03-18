import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UpsertGradeDto {
  studentId: string;
  subjectId: string;
  teacherId: string;
  term: string;
  score: number;
  maxScore?: number;
  letterGrade?: string;
  note?: string;
}

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async upsertGrade(dto: UpsertGradeDto) {
    const maxScore = dto.maxScore ?? 20;
    if (maxScore <= 0 || maxScore > 20) {
      throw new BadRequestException('maxScore must be between 1 and 20');
    }
    if (dto.score < 0 || dto.score > maxScore) {
      throw new BadRequestException(`score must be between 0 and ${maxScore}`);
    }

    return this.prisma.grade.upsert({
      where: {
        studentId_subjectId_term: {
          studentId: dto.studentId,
          subjectId: dto.subjectId,
          term: dto.term,
        },
      },
      create: {
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        term: dto.term,
        score: dto.score,
        maxScore,
        letterGrade: dto.letterGrade,
        note: dto.note,
      },
      update: {
        score: dto.score,
        maxScore,
        letterGrade: dto.letterGrade,
        note: dto.note,
        teacherId: dto.teacherId,
        gradedAt: new Date(),
      },
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
        subject: { select: { name: true, code: true } },
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
  }

  async bulkUpsert(grades: UpsertGradeDto[]) {
    return Promise.all(grades.map((g) => this.upsertGrade(g)));
  }

  async getStudentGrades(studentId: string, term?: string) {
    const where: any = { studentId };
    if (term) where.term = term;

    return this.prisma.grade.findMany({
      where,
      include: {
        subject: { select: { name: true, code: true, color: true } },
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: [{ term: 'desc' }, { subject: { name: 'asc' } }],
    });
  }

  async getClassGrades(classId: string, subjectId: string, term: string) {
    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { classId, isActive: true },
      select: { studentId: true },
    });

    const studentIds = enrollments.map((e) => e.studentId);

    return this.prisma.grade.findMany({
      where: { studentId: { in: studentIds }, subjectId, term },
      include: {
        student: {
          include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        },
      },
      orderBy: { score: 'desc' },
    });
  }

  async getGradeDistribution(schoolId: string, term: string) {
    const grades = await this.prisma.grade.findMany({
      where: { student: { schoolId }, term },
      select: { score: true, maxScore: true },
    });

    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    for (const g of grades) {
      const pct = (Number(g.score) / Number(g.maxScore)) * 100;
      if (pct >= 90) distribution.A++;
      else if (pct >= 80) distribution.B++;
      else if (pct >= 70) distribution.C++;
      else if (pct >= 60) distribution.D++;
      else distribution.F++;
    }

    return distribution;
  }
}
