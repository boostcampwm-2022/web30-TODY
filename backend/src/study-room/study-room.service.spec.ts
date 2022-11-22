import { Test, TestingModule } from '@nestjs/testing';
import { StudyRoomService } from './study-room.service';

describe('StudyRoomService', () => {
  let service: StudyRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyRoomService],
    }).compile();

    service = module.get<StudyRoomService>(StudyRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
