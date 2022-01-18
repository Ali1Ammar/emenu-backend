import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { OurConfigService } from './config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('E menu Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService: OurConfigService = app.get(OurConfigService);
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
  }));
  app.useStaticAssets('uploaded',{
    index:false,
    prefix:"/uploaded",
  });



  await app.listen(configService.getConfig().port);
}
bootstrap();
