"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
let PdfService = PdfService_1 = class PdfService {
    constructor() {
        this.logger = new common_1.Logger(PdfService_1.name);
    }
    async generateFromHtml(html) {
        try {
            const puppeteer = await Promise.resolve().then(() => require('puppeteer'));
            const browser = await puppeteer.default.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
            });
            await browser.close();
            return Buffer.from(pdfBuffer);
        }
        catch (err) {
            this.logger.error('PDF generation failed', err);
            throw err;
        }
    }
    buildCertificateHtml(params) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: #fff;
      color: #1C2B3A;
      padding: 40px;
    }
    .certificate {
      border: 3px solid ${params.accentColor};
      border-radius: 12px;
      padding: 50px;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .school-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .school-logo { width: 80px; height: 80px; object-fit: contain; }
    .school-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: ${params.primaryColor};
    }
    .divider {
      width: 100%;
      height: 2px;
      background: ${params.accentColor};
      margin: 24px 0;
    }
    .cert-type {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: ${params.primaryColor};
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }
    .student-name {
      font-size: 32px;
      font-weight: 700;
      color: ${params.accentColor};
      margin: 20px 0;
    }
    .body-text { font-size: 16px; line-height: 1.8; max-width: 600px; }
    .footer {
      margin-top: auto;
      padding-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
    }
    .issued-date { font-size: 13px; color: #8A9BB0; }
    .signature { text-align: right; }
    .signature-line { border-top: 1px solid #1C2B3A; width: 180px; margin-bottom: 6px; }
    .signature-name { font-size: 13px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="school-header">
      ${params.schoolLogo ? `<img class="school-logo" src="${params.schoolLogo}" alt="${params.schoolName}" />` : ''}
      <div class="school-name">${params.schoolName}</div>
    </div>
    <div class="divider"></div>
    <div class="cert-type">${params.certificateType}</div>
    <p class="body-text">This is to certify that</p>
    <div class="student-name">${params.studentName}</div>
    <p class="body-text">${params.bodyText}</p>
    <div class="divider"></div>
    <div class="footer">
      <div class="issued-date">Issued on: ${params.issuedDate}</div>
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">${params.authorizedBy ?? 'School Director'}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map