import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Seguridad')
    .setDescription('Evaluación de Seguridad Bootcamp')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('')
    .build();

  const document = SwaggerModule.createDocument(app, config, {

  });
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  await app.listen(3000);
}
bootstrap();
