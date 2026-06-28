import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar CORS para permitir llamadas del frontend
  app.enableCors({
    origin: '*', // En producción limitar al origen del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-api-key',
  });

  // 2. Configurar validación global y transformación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 3. Configurar OpenAPI/Swagger para documentar la API
  const config = new DocumentBuilder()
    .setTitle('SismoAlerta VE - API de Emergencia')
    .setDescription(
      'API pública y protegida para el registro, búsqueda y actualización de personas afectadas por el sismo en Venezuela.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  // 4. Iniciar servidor en el puerto configurado o 3000 por defecto
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n======================================================`);
  console.log(`SismoAlerta VE Backend ejecutándose en el puerto ${port}`);
  console.log(`Documentación de Swagger disponible en: http://localhost:${port}/api/v1/docs`);
  console.log(`======================================================\n`);
}
bootstrap();
