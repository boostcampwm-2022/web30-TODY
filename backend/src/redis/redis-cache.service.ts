import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setKey(key: string, value: string): Promise<boolean> {
    await this.cacheManager.set(key, value);
    return true;
  }

  async getValue(key: string): Promise<string> {
    const valueFromKey = (await this.cacheManager.get(key)) as string;
    return valueFromKey;
  }

  async getRoomValue(studyRoomId: number): Promise<any> {
    return await this.cacheManager.get(`studyRoom${studyRoomId}`);
  }

  async enterRoom(body: {
    studyRoomId: number;
    userId: string;
    nickname: string;
    isMaster: boolean;
  }): Promise<void> {
    const studyRoomId = body.studyRoomId;
    const userId = body.userId;
    const nickname = body.nickname;
    const isMaster = body.isMaster;
    const key = `studyRoom${studyRoomId}`;
    const roomValue = await this.cacheManager.get(key);

    if (roomValue) {
      roomValue[userId] = { nickname, isMaster };
      await this.cacheManager.set(key, roomValue);
      return;
    }

    if (!roomValue) {
      const roomValue = {};
      roomValue[userId] = { nickname, isMaster };
      await this.cacheManager.set(key, roomValue);
      return;
    }
  }

  async leaveRoom(body: {
    studyRoomId: number;
    userId: string;
  }): Promise<void> {
    const studyRoomId = body.studyRoomId;
    const userId = body.userId;
    const key = `studyRoom${studyRoomId}`;

    const roomValue = await this.cacheManager.get(key);
    delete roomValue[userId];
    await this.cacheManager.set(key, roomValue);
    return;
  }
}
