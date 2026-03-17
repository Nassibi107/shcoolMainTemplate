declare const _default: (() => {
    port: number;
    frontendUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: string;
    s3BucketName: string;
    s3Region: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    frontendUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: string;
    s3BucketName: string;
    s3Region: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
}>;
export default _default;
