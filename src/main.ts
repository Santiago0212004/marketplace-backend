import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: (arg0: any, arg1: any) => any;

async function bootstrap() {
  const expressApp = express();  // Crear la instancia de Express
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Aplicar los pipes de validación globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init(); // Inicializar la aplicación Nest sin escuchar en el puerto
  return expressApp; // Retornar la instancia de Express
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();  // Inicializar el servidor solo si no existe
  }
  return cachedServer(req, res);  // Reutilizar el servidor para manejar la solicitud
}
