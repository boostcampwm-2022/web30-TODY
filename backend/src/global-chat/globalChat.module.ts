import { Module } from '@nestjs/common';
import { globalChatGateway } from '../sfu/globalChat.gateway';

@Module({
  providers: [globalChatGateway],
})
export class globalChatModule {}
