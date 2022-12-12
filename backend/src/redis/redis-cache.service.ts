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

  async getIsInRoomValue(userId: string) {
    const isInRoom = await this.cacheManager.get<boolean>(`isInRoom${userId}`);
    return isInRoom || false;
  }

  async getRoomValue(studyRoomId: number): Promise<any> {
    return await this.cacheManager.get(`studyRoom${studyRoomId}`);
  }

  async deleteRoomValue(studyRoomId: number): Promise<any> {
    return await this.cacheManager.del(`studyRoom${studyRoomId}`);
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

    await this.cacheManager.set(`isInRoom${userId}`, true);

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

    await this.cacheManager.del(`isInRoom${userId}`);

    const roomValue = await this.cacheManager.get(key);
    delete roomValue[userId];
    await this.cacheManager.set(key, roomValue);
    return;
  }
}
