import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getSalt, getSecurePassword } from 'src/utils/salt';
import { CreateUserDto, CheckIdDto, CheckNicknameDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
