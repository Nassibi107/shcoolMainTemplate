export interface CertificateData {
  type: string;
  studentName: string;
  studentCode: string;
  class: string;
  academicYear: string;
  schoolName: string;
  issueDate: string;
  language: 'English' | 'Arabic' | 'French';
  attendanceRate?: string;
  averageGrade?: string;
}

const TRANSLATIONS = {
  English: {
    title: (type: string) => type,
    certify: 'This is to certify that',
    student: 'Student',
    code: 'Student Code',
    class: 'Class',
    academicYear: 'Academic Year',
    issued: 'Issue Date',
    attendance: 'Attendance Rate',
    grade: 'Academic Average',
    footer: 'This document is officially issued by',
    signature: 'School Principal',
    seal: 'OFFICIAL SEAL',
  },
  Arabic: {
    title: (type: string) => {
      const map: Record<string, string> = {
        'Registration Certificate': 'شهادة تسجيل',
        'Attendance Certificate': 'شهادة حضور',
        'Completion Certificate': 'شهادة إتمام الدراسة',
        'Grade Report': 'كشف الدرجات',
        'Good Conduct Certificate': 'شهادة حسن السير والسلوك',
      };
      return map[type] ?? type;
    },
    certify: 'يُشهد بأن',
    student: 'الطالب',
    code: 'رقم الطالب',
    class: 'الفصل الدراسي',
    academicYear: 'العام الدراسي',
    issued: 'تاريخ الإصدار',
    attendance: 'نسبة الحضور',
    grade: 'المعدل الأكاديمي',
    footer: 'هذه الوثيقة صادرة رسمياً من',
    signature: 'مدير المدرسة',
    seal: 'الختم الرسمي',
  },
  French: {
    title: (type: string) => {
      const map: Record<string, string> = {
        'Registration Certificate': "Certificat d'Inscription",
        'Attendance Certificate': 'Certificat de Présence',
        'Completion Certificate': "Certificat d'Achèvement",
        'Grade Report': 'Relevé de Notes',
        'Good Conduct Certificate': 'Certificat de Bonne Conduite',
      };
      return map[type] ?? type;
    },
    certify: 'Il est certifié que',
    student: 'Élève',
    code: "Code d'Étudiant",
    class: 'Classe',
    academicYear: 'Année Scolaire',
    issued: "Date d'Émission",
    attendance: 'Taux de Présence',
    grade: 'Moyenne Académique',
    footer: 'Ce document est officiellement délivré par',
    signature: 'Directeur de l\'École',
    seal: 'CACHET OFFICIEL',
  },
};

/**
 * Generates a certificate HTML string and triggers browser print-to-PDF.
 * Uses a hidden iframe to avoid disrupting the current page.
 */
export function generateCertificatePDF(data: CertificateData): void {
  const t = TRANSLATIONS[data.language];
  const isRTL = data.language === 'Arabic';
  const dir = isRTL ? 'rtl' : 'ltr';

  const html = `<!DOCTYPE html>
<html dir="${dir}" lang="${isRTL ? 'ar' : data.language === 'French' ? 'fr' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <title>${t.title(data.type)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: ${isRTL ? "'Segoe UI', Tahoma, Arial" : "'Plus Jakarta Sans', sans-serif"};
      background: #fff;
      color: #1e293b;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 20mm 18mm;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #fff;
    }

    /* Border frame */
    .border-outer {
      position: absolute;
      inset: 8mm;
      border: 3px solid #4361ee;
      border-radius: 4px;
    }
    .border-inner {
      position: absolute;
      inset: 10mm;
      border: 1px solid #c7d2fe;
      border-radius: 3px;
    }

    /* Corner ornaments */
    .corner {
      position: absolute;
      width: 12mm;
      height: 12mm;
      border-color: #4361ee;
      border-style: solid;
    }
    .corner-tl { top: 6mm; left: 6mm; border-width: 3px 0 0 3px; }
    .corner-tr { top: 6mm; right: 6mm; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 6mm; left: 6mm; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 6mm; right: 6mm; border-width: 0 3px 3px 0; }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 8mm;
    }
    .school-logo {
      width: 16mm;
      height: 16mm;
      background: #4361ee;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3mm;
    }
    .school-logo-text {
      color: #fff;
      font-size: 18px;
      font-weight: 800;
    }
    .school-name {
      font-size: 13pt;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .school-sub {
      font-size: 8pt;
      color: #64748b;
      margin-top: 1mm;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      gap: 4mm;
      margin: 5mm 0;
    }
    .divider-line { flex: 1; height: 1px; background: #e2e8f0; }
    .divider-diamond {
      width: 5mm; height: 5mm;
      background: #4361ee;
      transform: rotate(45deg);
    }

    /* Certificate title */
    .cert-title {
      text-align: center;
      font-size: 22pt;
      font-weight: 800;
      color: #4361ee;
      letter-spacing: 0.02em;
      margin-bottom: 2mm;
      text-transform: uppercase;
    }
    .cert-subtitle {
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 8mm;
    }

    /* Certify text */
    .certify-text {
      text-align: center;
      font-size: 10pt;
      color: #475569;
      margin-bottom: 4mm;
    }
    .student-name {
      text-align: center;
      font-size: 22pt;
      font-weight: 800;
      color: #1e293b;
      border-bottom: 2px solid #4361ee;
      padding-bottom: 2mm;
      margin: 0 15mm 6mm;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm 8mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3mm;
      padding: 5mm 8mm;
      margin-bottom: 8mm;
    }
    .info-item { display: flex; flex-direction: column; gap: 0.5mm; }
    .info-label { font-size: 7pt; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
    .info-value { font-size: 10pt; font-weight: 700; color: #1e293b; }

    /* Body text */
    .body-text {
      font-size: 10pt;
      color: #475569;
      line-height: 1.8;
      text-align: ${isRTL ? 'right' : 'justify'};
      margin-bottom: 8mm;
    }

    /* Signature row */
    .signature-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding-top: 8mm;
    }
    .sig-block { text-align: center; width: 45mm; }
    .sig-line { border-top: 1.5px solid #1e293b; padding-top: 2mm; margin-top: 12mm; }
    .sig-name { font-size: 9pt; font-weight: 700; color: #1e293b; }
    .sig-title { font-size: 7pt; color: #64748b; margin-top: 0.5mm; }

    .seal-block {
      width: 30mm; height: 30mm;
      border: 3px solid #4361ee;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1mm;
    }
    .seal-text { font-size: 6pt; font-weight: 700; color: #4361ee; text-align: center; letter-spacing: 0.05em; text-transform: uppercase; }

    /* Footer */
    .footer {
      text-align: center;
      font-size: 7pt;
      color: #94a3b8;
      margin-top: 6mm;
      padding-top: 3mm;
      border-top: 1px solid #e2e8f0;
    }

    @media print {
      body { padding: 0; }
      .page { margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Border frame -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- Header -->
    <div class="header">
      <div class="school-logo"><span class="school-logo-text">S</span></div>
      <p class="school-name">${data.schoolName}</p>
      <p class="school-sub">Excellence in Education</p>
    </div>

    <div class="divider">
      <div class="divider-line"></div>
      <div class="divider-diamond"></div>
      <div class="divider-line"></div>
    </div>

    <!-- Title -->
    <p class="cert-title">${t.title(data.type)}</p>
    <p class="cert-subtitle">Official Document · ${data.issueDate}</p>

    <!-- Certify -->
    <p class="certify-text">${t.certify}</p>
    <p class="student-name">${data.studentName}</p>

    <!-- Info grid -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">${t.code}</span>
        <span class="info-value">${data.studentCode}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.class}</span>
        <span class="info-value">${data.class}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.academicYear}</span>
        <span class="info-value">${data.academicYear}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.issued}</span>
        <span class="info-value">${data.issueDate}</span>
      </div>
      ${data.attendanceRate ? `<div class="info-item"><span class="info-label">${t.attendance}</span><span class="info-value">${data.attendanceRate}</span></div>` : ''}
      ${data.averageGrade ? `<div class="info-item"><span class="info-label">${t.grade}</span><span class="info-value">${data.averageGrade}</span></div>` : ''}
    </div>

    <!-- Body -->
    <p class="body-text">
      ${getBodyText(data, t)}
    </p>

    <!-- Signatures -->
    <div class="signature-row">
      <div class="sig-block">
        <div class="sig-line">
          <p class="sig-name">${t.signature}</p>
          <p class="sig-title">${data.schoolName}</p>
        </div>
      </div>
      <div class="seal-block">
        <span class="seal-text">${t.seal}</span>
        <span class="seal-text">${data.schoolName.split(' ')[0]}</span>
      </div>
      <div class="sig-block">
        <div class="sig-line">
          <p class="sig-name">Date</p>
          <p class="sig-title">${data.issueDate}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p class="footer">${t.footer} ${data.schoolName} · ${data.issueDate} · Document No: ${generateDocNumber()}</p>
  </div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for fonts then print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 2000);
  }, 800);
}

function getBodyText(data: CertificateData, t: typeof TRANSLATIONS['English']): string {
  const { type, studentName, class: cls, academicYear, schoolName } = data;
  if (type === 'Registration Certificate') {
    return `${studentName} is duly enrolled as a student at ${schoolName} in Class ${cls} for the Academic Year ${academicYear}. This certificate is issued upon request to serve its intended purpose.`;
  }
  if (type === 'Attendance Certificate') {
    return `${studentName}, a student in Class ${cls} at ${schoolName}, has maintained an attendance rate of ${data.attendanceRate ?? 'above 90%'} during the Academic Year ${academicYear}. This certificate is issued upon request.`;
  }
  if (type === 'Grade Report') {
    return `${studentName}, enrolled in Class ${cls} at ${schoolName} for the Academic Year ${academicYear}, has achieved an academic average of ${data.averageGrade ?? '—'} during this period. This report is issued upon official request.`;
  }
  if (type === 'Good Conduct Certificate') {
    return `${studentName}, a student in Class ${cls} at ${schoolName}, has demonstrated exemplary behavior and good conduct throughout the Academic Year ${academicYear}. This certificate is issued in recognition of their character.`;
  }
  return `${studentName} is a registered student in Class ${cls} at ${schoolName} for the Academic Year ${academicYear}. This document is issued upon official request to serve its intended purpose.`;
}

function generateDocNumber(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
}
