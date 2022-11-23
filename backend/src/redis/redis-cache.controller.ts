import { Body, Controller, Get, Post } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller()
export class RedisCacheController {
  constructor(private redisCacheService: RedisCacheService) {}

  @Get('/cache')
  async getCache(): Promise<string> {
    const value = await this.redisCacheService.getKey('test');
    console.log(value);
    return value;
  }

  @Post('/cache')
  async setCache(@Body() cache): Promise<boolean> {
    const result = await this.redisCacheService.setKey(cache.key, cache.value);
    return result;
  }
}
