import { CacheModule, Module, UseFilters } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';
import { RedisExceptionFilter } from 'src/filter/redis-exception.filter';

@UseFilters(RedisExceptionFilter)
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ttl: 0,
    }),
  ],
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
