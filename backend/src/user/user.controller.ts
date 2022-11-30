import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Res,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto } from './dto/user.dto';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('silent-login')
  async silentLogin(
    @Req() request: Request,
  ): Promise<{ userId: string; nickname: string }> {
    const { accessToken } = request.cookies;
    const { userId, nickname } = await this.userService.silentLogin(
      accessToken,
    );
    return { userId, nickname };
  }

  @Post('signup')
  async signup(@Body() userData: CreateUserDto): Promise<{ nickname: string }> {
    const { nickname } = await this.userService.createUser(userData);
    return { nickname };
  }

  @Get('checkID/:id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<{ isUnique: boolean; id: string }> {
    const checkId = await this.userService.findOneById({ id });
    return checkId ? { isUnique: false, id } : { isUnique: true, id };
  }

  @Get('checkNickname/:nickname')
  async findOneByNickname(
    @Param('nickname') nickname: string,
  ): Promise<{ isUnique: boolean; nickname: string }> {
    const checkNickname = await this.userService.findOneByNickname({
      nickname,
    });
    return checkNickname
      ? { isUnique: false, nickname }
      : { isUnique: true, nickname };
  }

  @Post('login')
  async login(
    @Body() userData: ReadUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ userId: string; nickname: string }> {
    const { accessToken, userId, nickname } = await this.userService.login(
      userData,
    );
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 43200,
    });
    return { userId, nickname };
  }

  @Get('logout')
  @HttpCode(204)
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    response.clearCookie('accessToken');
    return;
  }
}
