import { Module } from '@nestjs/common';
import { globalChatGateway } from './globalChat.gateway';
import { SfuGateway } from './sfu.gateway';

@Module({
  providers: [SfuGateway, globalChatGateway],
})
export class SfuModule {}
