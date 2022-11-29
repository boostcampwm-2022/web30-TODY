import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(__dirname, process.env.KEY_PATH)),
  //   cert: fs.readFileSync(path.join(__dirname, process.env.CERT_PATH)),
  // };
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(5000);
}
bootstrap();
