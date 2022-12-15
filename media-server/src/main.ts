import { NestFactory } from '@nestjs/core';
//import { MediaServerModule } from './mediaServer/mediaServer.module';
import { SfuModule } from './sfu/sfu.module';

async function bootstrap() {
  const port = 9000;
  console.log(`Server is running on port ${port}`);
  //const mediaServerApp = await NestFactory.create(MediaServerModule);
  const mediaServerApp = await NestFactory.create(SfuModule);
  await mediaServerApp.listen(port);
}
bootstrap();
