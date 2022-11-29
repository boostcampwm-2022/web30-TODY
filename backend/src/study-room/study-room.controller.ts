import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { StudyRoomService } from './study-room.service';
import { createRoomDto } from './dto/createRoom.dto';

@Controller('study-room')
export class StudyRoomController {
  constructor(private studyRoomService: StudyRoomService) {}

  @Post()
  @HttpCode(200)
  async createRoom(@Body() roomInfo: createRoomDto): Promise<void> {
    await this.studyRoomService.createStudyRoom(roomInfo);
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
}
