import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyRoom } from './entities/studyRoom.entity';
import { Repository, Like } from 'typeorm';
import { createRoomDto } from './dto/createRoom.dto';
import { dateFormatter } from 'src/utils/dateFormatter';

@Injectable()
export class StudyRoomService {
  constructor(
    @InjectRepository(StudyRoom)
    private studyRoomRepository: Repository<StudyRoom>,
  ) {}

  async createStudyRoom(roomInfo: createRoomDto) {
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
    if (!keyword) {
      keyword = '';
    }
    const currentPage = page > 0 ? page : 1;
    const studyRoomListData = await this.studyRoomRepository.find({
      where: [
        { studyRoomName: Like('%' + keyword + '%') },
        { studyRoomContent: Like('%' + keyword + '%') },
        { tag1: Like('%' + keyword + '%') },
        { tag2: Like('%' + keyword + '%') },
      ],
      order: {
        createTime: {
          direction: 'DESC',
        },
      },
      take: 9,
      skip: 9 * (currentPage - 1),
    });
    console.log(studyRoomListData);
    const totalCount = await this.studyRoomRepository.count();
    const pageCount = Math.ceil(totalCount / 9);
    const studyRoomList = studyRoomListData.map((roomInfo) => {
      const tags = [];
      if (roomInfo.tag1) {
        tags.push(roomInfo.tag1);
      }
      if (roomInfo.tag2) {
        tags.push(roomInfo.tag2);
      }

      const data = {
        studyRoomId: roomInfo.studyRoomId,
        name: roomInfo.studyRoomName,
        content: roomInfo.studyRoomContent,
        maxPersonnel: roomInfo.maxPersonnel,
        currentPersonnel: 1,
        tags,
        created: dateFormatter(roomInfo.createTime),
      };
      return data;
    });

    const searchResult = {
      keyword,
      currentPage,
      pageCount,
      totalCount,
      studyRoomList,
    };
    return searchResult;
  }
}
