import { NestFactory } from '@nestjs/core';
import corsConfig from './config/cors.config';
import { MediaServerModule } from './mediaServer/mediaServer.module';

async function bootstrap() {
  console.log('Server is running.');
  const mediaServerApp = await NestFactory.create(MediaServerModule, {
    cors: true,
  });
  await mediaServerApp.listen(8000);
}
bootstrap();
