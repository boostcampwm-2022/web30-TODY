import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setKey(key: string, value: string): Promise<boolean> {
    await this.cacheManager.set(key, value);
    return true;
  }

  async getKey(key: string): Promise<string> {
    const valueFromKey = (await this.cacheManager.get(key)) as string;
    return valueFromKey;
  }
}
