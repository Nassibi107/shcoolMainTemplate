"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-refresh-secret',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    s3BucketName: process.env.S3_BUCKET_NAME ?? '',
    s3Region: process.env.S3_REGION ?? 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
}));
//# sourceMappingURL=app.config.js.map