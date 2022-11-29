import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getSalt, getSecurePassword } from '../utils/salt';
import {
  CreateUserDto,
  CheckIdDto,
  CheckNicknameDto,
  ReadUserDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser({
    id,
    password,
    nickname,
  }: CreateUserDto): Promise<{ nickname: string }> {
    const salt = await getSalt();
    const securePassword = await getSecurePassword(password, salt);
    const result = await this.userRepository.insert({
      userId: id,
      userPw: securePassword,
      nickname,
      salt,
    });
    const insertedUserId = result.identifiers[0].userId;
    return this.userRepository.findOne({
      where: { userId: insertedUserId },
      select: ['nickname'],
    });
  }

  async findOneById({ id }: CheckIdDto): Promise<User> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async findOneByNickname({ nickname }: CheckNicknameDto): Promise<User> {
    return this.userRepository.findOne({
      where: { nickname },
    });
  }

  async validateUser({ id, password }: ReadUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
    if (!user) return false;
    const securePassword = await getSecurePassword(password, user.salt);
    return user.userPw !== securePassword ? false : true;
  }

  async login(userData: ReadUserDto): Promise<{ accessToken: string }> {
    const isValidated = await this.validateUser(userData);
    if (isValidated) {
      return {
        accessToken: this.jwtService.sign(
          {},
          {
            expiresIn: '10s',
            issuer: 'tody',
            subject: userData.id,
          },
        ),
      };
    } else {
      throw new HttpException('로그인 실패', HttpStatus.UNAUTHORIZED);
    }
  }
}
