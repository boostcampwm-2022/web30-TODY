import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/redis/redis-cache.module';
import { StudyRoom } from './entities/studyRoom.entity';
import { StudyRoomController } from './study-room.controller';
import { StudyRoomService } from './study-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRoom]), RedisCacheModule],
  controllers: [StudyRoomController],
  providers: [StudyRoomService],
})
export class StudyRoomModule {}
