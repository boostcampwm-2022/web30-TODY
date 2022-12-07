import { NestFactory } from '@nestjs/core';
import { MediaServerModule } from './mediaServer/mediaServer.module';

async function bootstrap() {
  const port = 9000;
  console.log(`Server is running on port ${port}`);
  const mediaServerApp = await NestFactory.create(MediaServerModule);
  await mediaServerApp.listen(port);
}
bootstrap();
