import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', process.env.KEY_PATH)),
    cert: fs.readFileSync(path.join(__dirname, '..', process.env.CERT_PATH)),
  };
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
