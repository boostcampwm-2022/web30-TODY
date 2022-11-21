import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('T_COMMENT', { schema: 'tody' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'COMMENT_ID' })
  commentId: number;

  @Column('varchar', { name: 'COMMENT_CONTENT', nullable: true, length: 4000 })
  commentContent: string | null;

  @Column('timestamp', { name: 'CREATE_TIME', nullable: true })
  createTime: Date | null;

  @Column('int', { name: 'QUESTION_ID' })
  questionId: number;

  @Column('varchar', { name: 'USER_ID', length: 50 })
  userId: string;

  @ManyToMany(() => User, (User) => User.Comments)
  @JoinTable({
    name: 'T_COMMENT_LIKE',
    joinColumns: [{ name: 'COMMENT_ID', referencedColumnName: 'commentId' }],
    inverseJoinColumns: [{ name: 'USER_ID', referencedColumnName: 'userId' }],
    schema: 'tody',
  })
  Users: User[];
}
