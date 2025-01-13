import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { CustomValidationPipe } from 'src/pipe/Validation.pipe';
import { AppModule } from './app.module';
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
