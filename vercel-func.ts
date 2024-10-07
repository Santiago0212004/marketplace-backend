import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: process.env.CORS_ORIGINS || true,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('EasyNotes API')
      .setDescription('Documentation for EasyNotes API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        always: true,
      }),
    );

    SwaggerModule.setup('api', app, document);

    await app.init();
  }

  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();

  instance(req, res);
}
