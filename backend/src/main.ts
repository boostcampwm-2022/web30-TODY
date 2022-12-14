import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';
import corsConfig from './config/cors.config';
import { SfuModule } from './sfu/sfu.module';
import { globalChatModule } from './global-chat/globalChat.module';
import * as pm2ClusterCache from 'pm2-cluster-cache';

async function bootstrap() {
  console.log(pm2ClusterCache);
  const cache = await pm2ClusterCache.init({
    storage: 'cluster',
    defaultTtl: 0,
  });
  console.log(cache);
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
  console.log('Server is running.');
  const globalChatApp = await NestFactory.create(globalChatModule, {
    cors: true,
  });
  await globalChatApp.listen(8000);
  const sfuApp = await NestFactory.create(SfuModule, {
    cors: true,
  });
  await sfuApp.listen(9000);
}
bootstrap();
