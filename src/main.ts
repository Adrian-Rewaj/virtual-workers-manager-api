import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config as appConfig } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  if (appConfig.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(appConfig.app.name)
      .setDescription(appConfig.app.description)
      .setVersion(appConfig.app.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig.swagger.route, app, document);
  }

  app.use(helmet());

  await app.listen(appConfig.app.port);
}
bootstrap();
