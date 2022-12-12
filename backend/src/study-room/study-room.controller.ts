import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StudyRoomService } from './study-room.service';
import { createRoomDto } from './dto/createRoom.dto';
import { DeleteResult } from 'typeorm';

@Controller('study-room')
export class StudyRoomController {
  constructor(private studyRoomService: StudyRoomService) {}

  @Post()
  @HttpCode(200)
  async createRoom(@Body() roomInfo: createRoomDto): Promise<any> {
    const createdRoomID = await this.studyRoomService.createStudyRoom(roomInfo);
    return createdRoomID;
  }

  @Get()
  @HttpCode(200)
  async searchRoom(
    @Query('keyword') keyword: string,
    @Query('attendable') attendable: boolean,
    @Query('page') page: number,
  ): Promise<any> {
    const searchResult = await this.studyRoomService.searchStudyRoomList(
      keyword,
      attendable,
      page,
    );
    return searchResult;
  }

  @Get('/roomInfo/:roomId')
  async getRoom(@Param('roomId') roomId: number): Promise<{
    studyRoomId: number;
    name: string;
    content: string;
    currentPersonnel: number;
    maxPersonnel: number;
    managerNickname: string;
    tags: string[];
    nickNameOfParticipants: string[];
    created: string;
  }> {
    const result = await this.studyRoomService.getStudyRoom(roomId);
    return result;
  }

  @Get('/participants')
  @HttpCode(200)
  async getParticiantsOfRoom(
    @Query('study-room-id') studyRoomId: string,
  ): Promise<any> {
    const participantsList = await this.studyRoomService.getParticipants(
      studyRoomId,
    );
    return participantsList;
  }

  @Post('/check-is-full')
  async checkIsFull(
    @Body() body: { studyRoomId: number },
  ): Promise<{ isFull: boolean }> {
    const isFull = await this.studyRoomService.checkIsFull(body.studyRoomId);
    return { isFull };
  }

  @Post('/check-master')
  @HttpCode(200)
  async checkMasterOfRoom(
    @Body() info: { studyRoomId: number; userId: string },
  ): Promise<boolean> {
    const isMaster = await this.studyRoomService.checkMasterOfRoom(
      info.studyRoomId,
      info.userId,
    );
    return isMaster;
  }

  @Post('/deleteRoom')
  async leave(@Body() body: { studyRoomId: number }): Promise<DeleteResult> {
    return await this.studyRoomService.deleteRoom(body.studyRoomId);
  }
}
