"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Scope School API')
        .setDescription('School Management System REST API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`Scope School API running on http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map