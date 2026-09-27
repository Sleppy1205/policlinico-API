// ============================================
// main.ts
// Punto de entrada de la aplicación NestJS.
// Aquí se levanta el servidor HTTP y se configuran
// los pipes globales de validación.
// ============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---- Prefijo global para todas las rutas ----
  // Todas las rutas empezarán con /api
  // Ej: /api/pacientes, /api/usuarios
  app.setGlobalPrefix('api');

  // ---- Pipe global de validación ----
  // Valida automáticamente todos los DTOs de entrada
  // transform:   convierte los tipos automáticamente (ej: string a number)
  // whitelist:   elimina propiedades que no estén en el DTO
  // forbidNonWhitelisted: rechaza la solicitud si viene una propiedad no permitida
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ---- Habilitar CORS ----
  // Permite que el frontend (React) pueda llamar a la API
  app.enableCors();

  const puerto = process.env.PORT ?? 3000;
  await app.listen(puerto);
  console.log(`🏥 API Policlínico ULEAM corriendo en: http://localhost:${puerto}/api`);
}

bootstrap();