import { Module } from '@nestjs/common';
import { SfuGateway } from './sfu.gateway';

@Module({
  providers: [SfuGateway],
})
export class SfuModule {}
