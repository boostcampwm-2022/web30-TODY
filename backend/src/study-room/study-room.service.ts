import { Injectable, Inject, BadRequestException } from '@nestjs/common';
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

  async getParticipants(studyRoomId: string) {
    const studyRoomValue = await this.redisCacheService.getValue(studyRoomId);
    return studyRoomValue;
  }

  async createStudyRoom(roomInfo: createRoomDto) {
    const result = await this.studyRoomRepository.insert({
      studyRoomName: roomInfo.name,
      studyRoomContent: roomInfo.content,
      maxPersonnel: roomInfo.maxPersonnel,
      managerId: {
        userId: roomInfo.managerId,
      },
      tag1: roomInfo.tags[0],
      tag2: roomInfo.tags[1],
      createTime: new Date(),
    });

    return result.raw.insertId;
  }

  async searchAttendableList(keyword: string, currentPage: number) {
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

  async searchAllList(keyword: string, currentPage: number) {
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

  async searchStudyRoomList(
    keyword: string,
    attendable: boolean,
    page: number,
  ) {
    keyword = keyword ? keyword : '';
    const currentPage = page > 0 ? page : 1;
    const studyRoomList = attendable
      ? await this.searchAttendableList(keyword, currentPage)
      : await this.searchAllList(keyword, currentPage);
    return studyRoomList;
  }

  async getStudyRoom(roomId: number) {
    const roomInfo = await this.studyRoomRepository.findOne({
      relations: { managerId: true },
      where: { studyRoomId: roomId },
    });
    const participants = await this.redisCacheService.getRoomValue(roomId);
    const currentPersonnel = participants
      ? Object.values(participants).length
      : 0;
    const nickNameOfParticipants = participants
      ? Object.values(participants).map(
          (p: { nickname: string; isMaster: boolean }) => p.nickname,
        )
      : [];
    return {
      studyRoomId: roomId,
      name: roomInfo.studyRoomName,
      content: roomInfo.studyRoomContent,
      currentPersonnel,
      maxPersonnel: roomInfo.maxPersonnel,
      managerNickname: roomInfo.managerId.nickname,
      tags: [roomInfo.tag1, roomInfo.tag2],
      nickNameOfParticipants,
      created: dateFormatter(roomInfo.createTime),
    };
  }

  async checkEnterable(roomId: number, userId: string) {
    const isInRoom = await this.redisCacheService.getValue(`isInRoom${userId}`);
    if (isInRoom)
      throw new BadRequestException('이미 다른 방에 참여 중입니다.');
    const isRoomExist = await this.studyRoomRepository.count({
      where: { studyRoomId: roomId },
    });
    if (!isRoomExist) throw new BadRequestException('존재하지 않는 방입니다.');
    const participants = await this.redisCacheService.getRoomValue(roomId);
    const room = await this.studyRoomRepository.findOne({
      where: { studyRoomId: roomId },
    });
    const isFull =
      room.maxPersonnel <= Object.values(participants || {}).length;
    if (isFull)
      throw new BadRequestException('방 입장 최대 인원을 초과하였습니다.');
    return { enterable: true };
  }

  async checkMasterOfRoom(studyRoomId: number, userId: string) {
    const res = await this.studyRoomRepository.find({
      relations: { managerId: true },
      where: {
        studyRoomId: studyRoomId,
      },
    });
    const isMaster = res[0].managerId.userId === userId ? true : false;
    return isMaster;
  }

  async deleteRoom(studyRoomId: number) {
    const res = await this.studyRoomRepository.delete({
      studyRoomId: studyRoomId,
    });
    await this.redisCacheService.deleteRoomValue(studyRoomId);
    return res;
  }
}
