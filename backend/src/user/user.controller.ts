import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @HttpCode(200)
  async signup(
    @Body() userInfo: { id: string; password: string; nickname: string },
  ): Promise<{ nickname: string }> {
    try {
      const { nickname } = await this.userService.createUser(userInfo);
      return { nickname };
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'bad request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('checkID')
  @HttpCode(200)
  async findOneById(@Query('id') id: string): Promise<{ isUnique: boolean }> {
    try {
      const checkId = await this.userService.findOneById(id);
      return checkId ? { isUnique: true } : { isUnique: false };
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

  @Get('checkNickname')
  @HttpCode(200)
  async findOneByNickname(
    @Query('nickname') nickname: string,
  ): Promise<{ isUnique: boolean }> {
    try {
      const checkNickname = await this.userService.findOneByNickname(nickname);
      return checkNickname ? { isUnique: true } : { isUnique: false };
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
