import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CommentModule } from './comment/comment.module';
import { QuestionBoardModule } from './question-board/question-board.module';
import { StudyRoomModule } from './study-room/study-room.module';
import { Comment } from './comment/entities/comments.entity';
import { QuestionBoard } from './question-board/entities/questionBoard.entity';
import { StudyRoom } from './study-room/entities/studyRoom.entity';
import { Image } from './question-board/entities/image.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Comment, QuestionBoard, StudyRoom, Image],
      synchronize: false,
    }),
    UserModule,
    CommentModule,
    QuestionBoardModule,
    StudyRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
