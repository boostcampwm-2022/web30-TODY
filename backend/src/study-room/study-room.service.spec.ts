import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudyRoom } from './entities/studyRoom.entity';
import { StudyRoomService } from './study-room.service';
import { Repository } from 'typeorm';
import { RedisCacheService } from '../redis/redis-cache.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockUserRepository = () => ({
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('StudyRoomService', () => {
  let service: StudyRoomService;
  let studyRoomRepository: MockRepository<StudyRoom>;
  let redisCacheService: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        StudyRoomService,
        {
          provide: getRepositoryToken(StudyRoom),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<StudyRoomService>(StudyRoomService);
    studyRoomRepository = module.get<MockRepository<StudyRoom>>(
      getRepositoryToken(StudyRoom),
    );
    redisCacheService = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
