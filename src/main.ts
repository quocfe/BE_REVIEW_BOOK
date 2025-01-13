import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipe/Validation.pipe';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.NEXT_PORT_CLIENT, process.env.NEXT_PORT_CMS],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  console.log('app listening on port', process.env.PORT ?? 3000);
}
bootstrap();
