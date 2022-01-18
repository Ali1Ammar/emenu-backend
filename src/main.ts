import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { OurConfigService } from './config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    logger :[
      'debug','error',"warn","verbose","log"
    ]
  });
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
  app.use(morgan('tiny'));
  app.useStaticAssets('uploaded',{
    index:false,
    prefix:"/uploaded",
  });



  await app.listen(configService.getConfig().port);
}
bootstrap();
