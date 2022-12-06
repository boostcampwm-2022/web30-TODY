import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { SocketModule } from './socket/socket.module';
import * as cookieParser from 'cookie-parser';
import corsConfig from './config/cors.config';
import { MediaServerModule } from './mediaServer/mediaServer.module';
import { SfuModule } from './sfu/sfu.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsConfig,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(5000);
  // const socketApp = await NestFactory.create(SocketModule, {
  //   cors: true,
  // });
  // await socketApp.listen(8000);
  // console.log('Server is running.');
  // const mediaServer = await NestFactory.create(MediaServerModule, {
  //   cors: true,
  // });
  // await mediaServer.listen(8000);
  const sfuApp = await NestFactory.create(SfuModule, {
    cors: true,
  });
  await sfuApp.listen(8000);
}
bootstrap();
