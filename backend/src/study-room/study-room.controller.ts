import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { StudyRoomService } from './study-room.service';
import { createRoomDto } from './dto/createRoom.dto';

@Controller('study-room')
export class StudyRoomController {
  constructor(private studyRoomService: StudyRoomService) {}

  @Post()
  @HttpCode(200)
  async createRoom(@Body() roomInfo: createRoomDto): Promise<any> {
    try {
      const createdRoomID = await this.studyRoomService.createStudyRoom(
        roomInfo,
      );
      return createdRoomID;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Unexpected error',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get()
  @HttpCode(200)
  async searchRoom(
    @Query('keyword') keyword: string,
    @Query('attendable') attendable: boolean,
    @Query('page') page: number,
  ): Promise<any> {
    try {
      const searchResult = await this.studyRoomService.searchStudyRoomList(
        keyword,
        attendable,
        page,
      );
      return searchResult;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Unexpected error',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
