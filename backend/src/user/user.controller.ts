import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(@Body() userData: CreateUserDto): Promise<{ nickname: string }> {
    const { nickname } = await this.userService.createUser(userData);
    return { nickname };
  }

  @Get('checkID/:id')
  async findOneById(@Param('id') id: string): Promise<{ isUnique: boolean }> {
    const checkId = await this.userService.findOneById({ id });
    return checkId ? { isUnique: false } : { isUnique: true };
  }

  @Get('checkNickname/:nickname')
  async findOneByNickname(
    @Param('nickname') nickname: string,
  ): Promise<{ isUnique: boolean }> {
    const checkNickname = await this.userService.findOneByNickname({
      nickname,
    });
    return checkNickname ? { isUnique: false } : { isUnique: true };
  }
}
