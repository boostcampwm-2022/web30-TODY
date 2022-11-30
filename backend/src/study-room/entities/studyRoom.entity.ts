import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('T_STUDY_ROOM', { schema: 'tody' })
export class StudyRoom {
  @PrimaryGeneratedColumn({ type: 'int', name: 'STUDY_ROOM_ID' })
  studyRoomId: number;

  @Column('varchar', { name: 'STUDY_ROOM_NAME', nullable: true, length: 50 })
  studyRoomName: string | null;

  @Column('varchar', {
    name: 'STUDY_ROOM_CONTENT',
    nullable: true,
    length: 255,
  })
  studyRoomContent: string | null;

  @Column('int', { name: 'MAX_PERSONNEL', nullable: true })
  maxPersonnel: number | null;

  @Column('varchar', { name: 'TAG1', nullable: true, length: 50 })
  tag1: string | null;

  @Column('varchar', { name: 'TAG2', nullable: true, length: 50 })
  tag2: string | null;

  //@Column('varchar', { name: 'MANAGER_ID', length: 50 })
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'MANAGER_ID' })
  managerId: string;

  @Column('timestamp', { name: 'CREATE_TIME', nullable: true })
  createTime: Date | null;
}
