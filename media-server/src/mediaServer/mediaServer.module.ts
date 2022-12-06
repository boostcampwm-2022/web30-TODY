import { Module } from '@nestjs/common';
import { MediaServerGateway } from './mediaServer.gateway';

@Module({
  providers: [MediaServerGateway],
})
export class MediaServerModule {}
