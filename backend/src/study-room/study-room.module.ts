import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRoom } from './entities/studyRoom.entity';
import { StudyRoomController } from './study-room.controller';
import { StudyRoomService } from './study-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRoom])],
  controllers: [StudyRoomController],
  providers: [StudyRoomService],
})
export class StudyRoomModule {}
