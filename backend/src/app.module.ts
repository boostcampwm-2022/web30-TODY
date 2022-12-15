import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CommentModule } from './comment/comment.module';
import { StudyRoomModule } from './study-room/study-room.module';
import { Comment } from './comment/entities/comments.entity';
import { StudyRoom } from './study-room/entities/studyRoom.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Comment, StudyRoom],
      synchronize: false,
    }),
    RedisCacheModule,
    UserModule,
    CommentModule,
    StudyRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
