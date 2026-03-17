export declare class PdfService {
    private readonly logger;
    generateFromHtml(html: string): Promise<Buffer>;
    buildCertificateHtml(params: {
        schoolName: string;
        schoolLogo?: string;
        primaryColor: string;
        accentColor: string;
        studentName: string;
        certificateType: string;
        bodyText: string;
        issuedDate: string;
        authorizedBy?: string;
    }): string;
}
