import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CertificatesService } from '../certificates/certificates.service';
import { DocumentRequestStatus } from '@prisma/client';
import { NotificationType } from '@prisma/client';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ApproveRejectDocumentRequestDto } from './dto/approve-reject.dto';

@Injectable()
export class DocumentRequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private certificatesService: CertificatesService,
  ) {}

  async create(schoolId: string, requesterId: string, dto: CreateDocumentRequestDto) {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    if (!student) throw new NotFoundException('Student not found');

    const request = await this.prisma.documentRequest.create({
      data: {
        requesterId,
        studentId: dto.studentId,
        schoolId,
        documentType: dto.documentType,
        note: dto.note,
      },
      include: {
        requester: { select: { firstName: true, lastName: true } },
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    const requesterName = `${request.requester.firstName} ${request.requester.lastName}`;
    const notificationBody = `${requesterName} requested a ${dto.documentType} — ${new Date().toLocaleString()}`;

    const adminAndAssistantUsers = await this.prisma.user.findMany({
      where: {
        schoolId,
        role: { in: ['ADMIN', 'ASSISTANT'] },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    for (const u of adminAndAssistantUsers) {
      await this.notificationsService.send({
        userId: u.id,
        schoolId,
        type: NotificationType.DOCUMENT_REQUEST,
        title: 'New Document Request',
        body: notificationBody,
        link: '/notifications',
      });
    }

    return request;
  }

  async findAll(schoolId: string, filters: { status?: DocumentRequestStatus }) {
    const where: any = { schoolId };
    if (filters.status) where.status = filters.status;

    return this.prisma.documentRequest.findMany({
      where,
      include: {
        requester: { select: { firstName: true, lastName: true, email: true } },
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            classEnrollments: {
              where: { isActive: true },
              include: { class: { select: { name: true, code: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForRequester(requesterId: string, schoolId: string) {
    return this.prisma.documentRequest.findMany({
      where: { requesterId, schoolId },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            classEnrollments: {
              where: { isActive: true },
              include: { class: { select: { name: true } } },
            },
          },
        },
        certificate: { select: { id: true, pdfUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(
    id: string,
    schoolId: string,
    approverId: string,
    dto: ApproveRejectDocumentRequestDto,
  ) {
    const request = await this.prisma.documentRequest.findFirst({
      where: { id, schoolId },
      include: {
        requester: { select: { id: true, firstName: true, lastName: true, role: true } },
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
    if (!request) throw new NotFoundException('Document request not found');
    if (request.status !== DocumentRequestStatus.PENDING) {
      throw new ForbiddenException('Request is no longer pending');
    }

    const certType = this.mapDocumentTypeToCertType(request.documentType);
    await this.certificatesService.generate(schoolId, {
      studentId: request.studentId,
      type: certType,
    });

    const certificate = await this.prisma.certificate.findFirst({
      where: { studentId: request.studentId, schoolId, type: certType },
      orderBy: { issuedAt: 'desc' },
    });
    if (!certificate) throw new NotFoundException('Certificate was not created');

    await this.prisma.documentRequest.update({
      where: { id },
      data: {
        status: DocumentRequestStatus.APPROVED,
        approverId,
        approverNote: dto.note,
        certificateId: certificate.id,
        approvedAt: new Date(),
      },
    });

    const message = `Your ${request.documentType} request has been approved. Click here to download.`;
    await this.notificationsService.send({
      userId: request.requesterId,
      schoolId,
      type: NotificationType.DOCUMENT_READY,
      title: 'Document Request Approved',
      body: message,
      link: request.requester.role === 'PARENT' ? '/parent/documents' : '/student/certificates',
    });

    return this.prisma.documentRequest.findUnique({
      where: { id },
      include: {
        certificate: { select: { id: true } },
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
  }

  async reject(id: string, schoolId: string, approverId: string, dto: ApproveRejectDocumentRequestDto) {
    const request = await this.prisma.documentRequest.findFirst({
      where: { id, schoolId },
      include: { requester: { select: { id: true } } },
    });
    if (!request) throw new NotFoundException('Document request not found');
    if (request.status !== DocumentRequestStatus.PENDING) {
      throw new ForbiddenException('Request is no longer pending');
    }

    await this.prisma.documentRequest.update({
      where: { id },
      data: {
        status: DocumentRequestStatus.REJECTED,
        approverId,
        approverNote: dto.note,
        rejectedAt: new Date(),
      },
    });

    const reason = dto.note ? ` Reason: ${dto.note}` : '';
    const message = `Your ${request.documentType} request was rejected.${reason}`;
    await this.notificationsService.send({
      userId: request.requesterId,
      schoolId,
      type: NotificationType.DOCUMENT_READY,
      title: 'Document Request Rejected',
      body: message,
    });

    return { success: true };
  }

  async getPendingCount(schoolId: string): Promise<number> {
    return this.prisma.documentRequest.count({
      where: { schoolId, status: DocumentRequestStatus.PENDING },
    });
  }

  private mapDocumentTypeToCertType(documentType: string): 'REGISTRATION' | 'ATTENDANCE' | 'GRADUATION_REPORT' | 'COMPLETION' | 'DIPLOMA' | 'CUSTOM' {
    const map: Record<string, 'REGISTRATION' | 'ATTENDANCE' | 'GRADUATION_REPORT' | 'COMPLETION' | 'DIPLOMA' | 'CUSTOM'> = {
      'Registration Certificate': 'REGISTRATION',
      'Attendance Certificate': 'ATTENDANCE',
      'Grade Report': 'GRADUATION_REPORT',
      'Completion Certificate': 'COMPLETION',
      'Good Conduct Certificate': 'CUSTOM',
      'Medical Exemption': 'CUSTOM',
    };
    return map[documentType] ?? 'CUSTOM';
  }
}
