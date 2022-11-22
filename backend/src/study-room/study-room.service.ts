import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyRoom } from './entities/studyRoom.entity';
import { Repository } from 'typeorm';
import { createRoomDto } from './dto/createRoom.dto';

@Injectable()
export class StudyRoomService {
  constructor(
    @InjectRepository(StudyRoom)
    private studyRoomRepository: Repository<StudyRoom>,
  ) {}

  async createStudyRoom(roomInfo: createRoomDto) {
    console.log(roomInfo);

    await this.studyRoomRepository.insert({
      studyRoomName: roomInfo.name,
      studyRoomContent: roomInfo.content,
      maxPersonnel: roomInfo.maxPersonnel,
      managerId: '1',
      tag1: roomInfo.tags[0],
      tag2: roomInfo.tags[1],
      createTime: new Date(),
    });
  }

  async searchStudyRoomList(
    keyword: string,
    attendable: boolean,
    page: number,
  ) {
    const studyRoomList = await this.studyRoomRepository.find();
    const searchResult = {
      keyword,
      currentPage: page,
      pageCount: 5,
      totalCount: 45,
      studyRoomList,
    };
    return searchResult;
  }
}
