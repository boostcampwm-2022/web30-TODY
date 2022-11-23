import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, process.env.KEY_PATH)),
    cert: fs.readFileSync(path.join(__dirname, process.env.CERT_PATH)),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions, cors: true });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );
  // app.useGlobalFilters(new AllExceptionsFilter());
  // const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(5001);
  console.log('Server is running.');
}
bootstrap();
