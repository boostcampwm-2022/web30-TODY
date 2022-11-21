import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity('T_QUESTION_BOARD', { schema: 'tody' })
export class QuestionBoard {
  @PrimaryGeneratedColumn({ type: 'int', name: 'QUESTION_ID' })
  questionId: number;

  @Column('varchar', { name: 'USER_ID', length: 50 })
  userId: string;

  @Column('varchar', { name: 'QUESTION_TITLE', nullable: true, length: 100 })
  questionTitle: string | null;

  @Column('varchar', { name: 'QUESTION_CONTENT', nullable: true, length: 4000 })
  questionContent: string | null;

  @Column('timestamp', { name: 'CREATE_TIME', nullable: true })
  createTime: Date | null;

  @Column('int', { name: 'VIEWS', nullable: true })
  views: number | null;

  @OneToOne(() => Image, (Image) => Image.question)
  Image: Image;

  @ManyToMany(() => User, (User) => User.QuestionBoards)
  @JoinTable({
    name: 'T_QUESTION_LIKE',
    joinColumns: [{ name: 'QUESTION_ID', referencedColumnName: 'questionId' }],
    inverseJoinColumns: [{ name: 'USER_ID', referencedColumnName: 'userId' }],
    schema: 'tody',
  })
  Users: User[];
}
