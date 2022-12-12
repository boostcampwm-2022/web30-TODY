import { Module } from '@nestjs/common';
import { SfuGateway } from './sfu.gateway';
import { RedisCacheModule } from 'src/redis/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [SfuGateway],
})
export class SfuModule {}
