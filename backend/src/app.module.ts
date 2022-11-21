import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CommentModule } from './comment/comment.module';
import { QuestionBoardModule } from './question-board/question-board.module';
import { StudyRoomModule } from './study-room/study-room.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true,
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
