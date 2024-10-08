import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Review } from '../review/entity/review.entity'
import { ReviewSeller } from '../review/entity/reviewSeller.entity'
import { Repository } from 'typeorm';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
