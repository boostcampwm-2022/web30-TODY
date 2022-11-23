import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';

const cacheModule = CacheModule.register({
  store: redisStore,
  host: 'localhost',
  port: '6379',
  ttl: 0,
});

@Module({
  imports: [cacheModule],
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
