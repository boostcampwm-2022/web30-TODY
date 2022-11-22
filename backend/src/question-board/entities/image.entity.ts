import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { QuestionBoard } from './questionBoard.entity';

@Entity('T_IMAGE', { schema: 'tody' })
export class Image {
  @Column('int', { primary: true, name: 'QUESTION_ID' })
  questionId: number;

  @Column('varchar', { name: 'IMAGE_URL', nullable: true, length: 300 })
  imageUrl: string | null;

  @Column('int', { name: 'IMAGE_INDEX', nullable: true })
  imageIndex: number | null;

  @OneToOne(() => QuestionBoard, (QuestionBoard) => QuestionBoard.Image, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'QUESTION_ID', referencedColumnName: 'questionId' }])
  question: QuestionBoard;
}
