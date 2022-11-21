import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getSalt, getSecurePassword } from 'src/utils/salt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userInfo: {
    id: string;
    password: string;
    nickname: string;
  }): Promise<{ nickname: string }> {
    const salt = await getSalt();
    const securePassword = await getSecurePassword(userInfo.password, salt);
    const newUser = await this.userRepository.insert({
      userId: userInfo.id,
      userPw: securePassword,
      nickname: userInfo.nickname,
      salt,
    });
    const insertedId = newUser.identifiers[0].userId;
    const user = await this.userRepository.findOne({
      where: { userId: insertedId },
    });
    return { nickname: user.nickname };
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { userId: id } });
  }
  async findOneByNickname(nickname: string): Promise<User> {
    return this.userRepository.findOne({ where: { nickname: nickname } });
  }
}
