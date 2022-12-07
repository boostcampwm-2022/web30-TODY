import { Module } from '@nestjs/common';
import { globalChatGateway } from './globalChat.gateway';

@Module({
  providers: [globalChatGateway],
})
export class globalChatModule {}
