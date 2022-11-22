import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, process.env.KEY_PATH)),
    cert: fs.readFileSync(path.join(__dirname, process.env.CERT_PATH)),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(5000);
}
bootstrap();
