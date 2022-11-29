import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyRoom } from './entities/studyRoom.entity';
import { Repository, Like } from 'typeorm';
import { createRoomDto } from './dto/createRoom.dto';
import { dateFormatter } from '../utils/dateFormatter';
import { RedisCacheService } from '../redis/redis-cache.service';

@Injectable()
export class StudyRoomService {
  constructor(
    @InjectRepository(StudyRoom)
    private studyRoomRepository: Repository<StudyRoom>,
    @Inject(RedisCacheService)
    private redisCacheService: RedisCacheService,
  ) {}

  async createStudyRoom(roomInfo: createRoomDto) {
    const result = await this.studyRoomRepository.insert({
      studyRoomName: roomInfo.name,
      studyRoomContent: roomInfo.content,
      maxPersonnel: roomInfo.maxPersonnel,
      managerId: '1',
      tag1: roomInfo.tags[0],
      tag2: roomInfo.tags[1],
      createTime: new Date(),
    });

    return result.raw.insertId;
    // Todo: 방 이동을 시켜줄 정보를 리턴해줘야하는데 아직 없노....
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

    if (attendable) {
      const studyRoomListAllData = await this.studyRoomRepository.find({
        relations: { managerId: true },
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
      });
      const studyRoomListAllFullData = await Promise.all(
        studyRoomListAllData.map(async (roomInfo) => {
          const tags = [];
          if (roomInfo.tag1) {
            tags.push(roomInfo.tag1);
          }
          if (roomInfo.tag2) {
            tags.push(roomInfo.tag2);
          }

          const studyRoomValue = await this.redisCacheService.getRoomValue(
            roomInfo.studyRoomId,
          );

          const currentPersonnel = studyRoomValue
            ? Object.keys(studyRoomValue).length
            : 0;

          const nickNameOfParticipants = studyRoomValue
            ? Object.keys(studyRoomValue).map((e) => {
                return studyRoomValue[e].nickname;
              })
            : [];

          const data = {
            studyRoomId: roomInfo.studyRoomId,
            name: roomInfo.studyRoomName,
            content: roomInfo.studyRoomContent,
            currentPersonnel,
            maxPersonnel: roomInfo.maxPersonnel,
            managerNickname: roomInfo.managerId['nickname'],
            tags,
            nickNameOfParticipants,
            created: dateFormatter(roomInfo.createTime),
          };
          return data;
        }),
      );
      const studyRoomListAttendableData = studyRoomListAllFullData.filter(
        (roomInfo) => {
          if (roomInfo.currentPersonnel < roomInfo.maxPersonnel) {
            return true;
          }
          return false;
        },
      );

      const studyRoomList = studyRoomListAttendableData.filter(
        (roomInfo, index) => {
          if ((currentPage - 1) * 9 <= index && index < currentPage * 9) {
            return true;
          }
          return false;
        },
      );
      const totalCount = studyRoomListAttendableData.length;
      const pageCount = Math.ceil(totalCount / 9);
      const searchResult = {
        keyword,
        currentPage,
        pageCount,
        totalCount,
        studyRoomList,
      };
      return searchResult;
    }

    const studyRoomListData = await this.studyRoomRepository.find({
      relations: { managerId: true },
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
    const totalCount = await this.studyRoomRepository.count({
      where: [
        { studyRoomName: Like('%' + keyword + '%') },
        { studyRoomContent: Like('%' + keyword + '%') },
        { tag1: Like('%' + keyword + '%') },
        { tag2: Like('%' + keyword + '%') },
      ],
    });
    const pageCount = Math.ceil(totalCount / 9);
    const studyRoomList = await Promise.all(
      studyRoomListData.map(async (roomInfo) => {
        const tags = [];
        if (roomInfo.tag1) {
          tags.push(roomInfo.tag1);
        }
        if (roomInfo.tag2) {
          tags.push(roomInfo.tag2);
        }

        const studyRoomValue = await this.redisCacheService.getRoomValue(
          roomInfo.studyRoomId,
        );

        const currentPersonnel = studyRoomValue
          ? Object.keys(studyRoomValue).length
          : 0;

        const nickNameOfParticipants = studyRoomValue
          ? Object.keys(studyRoomValue).map((e) => {
              return studyRoomValue[e].nickname;
            })
          : [];

        const data = {
          studyRoomId: roomInfo.studyRoomId,
          name: roomInfo.studyRoomName,
          content: roomInfo.studyRoomContent,
          currentPersonnel,
          maxPersonnel: roomInfo.maxPersonnel,
          managerNickname: roomInfo.managerId['nickname'],
          tags,
          nickNameOfParticipants,
          created: dateFormatter(roomInfo.createTime),
        };
        return data;
      }),
    );

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
