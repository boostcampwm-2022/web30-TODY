import { Test, TestingModule } from '@nestjs/testing';
import { StudyRoomController } from './study-room.controller';
import { Repository } from 'typeorm';
import { StudyRoomService } from './study-room.service';
import { StudyRoom } from './entities/studyRoom.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisCacheService } from '../redis/redis-cache.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockStudyRoomRepository = () => ({
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('StudyRoomController', () => {
  let controller: StudyRoomController;
  let service: StudyRoomService;
  let studyRoomRepository: MockRepository<StudyRoom>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyRoomController],
      providers: [
        StudyRoomService,
        {
          provide: getRepositoryToken(StudyRoom),
          useValue: mockStudyRoomRepository(),
        },
        RedisCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StudyRoomController>(StudyRoomController);
    service = module.get<StudyRoomService>(StudyRoomService);
    studyRoomRepository = module.get<MockRepository<StudyRoom>>(
      getRepositoryToken(StudyRoom),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
