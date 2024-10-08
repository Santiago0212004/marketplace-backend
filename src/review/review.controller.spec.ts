import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { create } from 'domain';
import { NotFoundException } from '@nestjs/common';
import { ReviewSeller } from './entity/reviewSeller.entity';
import { Review } from './entity/review.entity';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  const mockReviewService = {
    create:jest.fn(),
    getAll:jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers:[
        {
          provide: ReviewService,
          useValue: mockReviewService
        }
      ]
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService)
  });
  describe('create', () => {

    const mockProductId = '123e4567-e89b-12d3-a456-426614174111';
    const mockSellerId = '123e4567-e89b-12d3-a456-426614174222';

    const createReviewDto = {
      rating: 3,
      comment: 'This a review comment test',
      id: mockProductId
    }

    const createReviewForSellerDto = {
      rating: 2,
      comment: 'This a seller review comment test',
      id: mockSellerId
    }

    const mockProduct = {
      id: '123e4567-e89b-12d3-a456-426614174111',
      name: 'Test Product',
      description: 'This is a test product description that is long enough',
      price: 99.99,
      mainImageUrl: 'http://test.com/image.jpg',
      seller: {
        id: mockSellerId,
        username: 'testUser'
      },
      subcategory: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Subcategory'
      },
      reviews: [],
      orders: [],
      sizes: []
    }

    const mockSeller = {
      id: mockSellerId,
      fullName: 'Test Seller',
      email: 'seller@test.com',
      password: 'hashedPassword',
      address: '123 Test St',
      role: {
        id: '123e4567-e89b-12d3-a456-426614174444',
        name: 'seller'
      },
      products: [],
      orders: [],
      reviews: []
    }

    const mockReview = {
      id: '123e4567-e89b-12d3-a456-426614174555',
      ...createReviewDto,
      product: mockProduct
    }

    const mockReviewSeller = {
      id: '123e4567-e89b-12d3-a456-426614174555',
      ...createReviewForSellerDto,
      product: mockSeller
    }
    
    it('should create a review for product successfully', async () =>{
      mockReviewService.create.mockResolvedValue(mockReview)

      const result = await controller.createReviewProduct(createReviewDto)
      expect(result).toEqual(mockReview)
      expect(service.create).toHaveBeenCalledWith(createReviewDto,'product');
    })

    it('should create a review for seller successfully', async () =>{
      mockReviewService.create.mockResolvedValue(mockReviewSeller)

      const result = await controller.createReviewSeller(createReviewForSellerDto)
      expect(result).toEqual(mockReviewSeller)
      expect(service.create).toHaveBeenCalledWith(createReviewForSellerDto,'seller')
    })

    it('should not create a review for product', async () =>{
      mockReviewService.create.mockResolvedValue({})

      await expect(controller.createReviewProduct({id:"5",...createReviewDto})).toBeInstanceOf(Promise<Review>)
    })

    it('should not create a review for seller', async () =>{
      mockReviewService.create.mockResolvedValue({})

      const result = await 
      await expect(controller.createReviewSeller(createReviewForSellerDto)).toBeInstanceOf(Promise<ReviewSeller> )
    })
    
  })

  describe('getAll', () => {
    const mockProductId = '123e4567-e89b-12d3-a456-426614174111';
    const mockSellerId = '123e4567-e89b-12d3-a456-426614174222';

    const createReviewDto = {
      rating: 3,
      comment: 'This a review comment test',
      id: mockProductId
    }

    const createReviewForSellerDto = {
      rating: 2,
      comment: 'This a seller review comment test',
      id: mockSellerId
    }
    const mockProduct = {
      id: '123e4567-e89b-12d3-a456-426614174111',
      name: 'Test Product',
      description: 'This is a test product description that is long enough',
      price: 99.99,
      mainImageUrl: 'http://test.com/image.jpg',
      seller: {
        id: mockSellerId,
        username: 'testUser'
      },
      subcategory: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Subcategory'
      },
      reviews: [],
      orders: [],
      sizes: []
    }

    const mockSeller = {
      id: mockSellerId,
      fullName: 'Test Seller',
      email: 'seller@test.com',
      password: 'hashedPassword',
      address: '123 Test St',
      role: {
        id: '123e4567-e89b-12d3-a456-426614174444',
        name: 'seller'
      },
      products: [],
      orders: [],
      reviews: []
    }

    const mockReview = {
      id: '123e4567-e89b-12d3-a456-426614174555',
      ...createReviewDto,
      product: mockProduct
    }

    const mockReviewSeller = {
      id: '123e4567-e89b-12d3-a456-426614174555',
      ...createReviewForSellerDto,
      product: mockSeller
    }
    const ReviewList = [mockReview]
    const ReviewSellerList = [mockReviewSeller]

    it('should return a review list successfully', async () => {
      mockReviewService.getAll.mockResolvedValue(ReviewList)

      const result = await controller.getReviewsProduct(mockProductId)
      expect(result).toEqual(ReviewList)
    })

    it('should return a review seller list successfully', async () => {
      mockReviewService.getAll.mockResolvedValue(ReviewSellerList)

      const result = await controller.getReviewsProduct(mockSellerId)
      expect(result).toEqual(ReviewSellerList)
    })

    it('should return a review empty list ', async () => {
      mockReviewService.getAll.mockResolvedValue([])

      const result = await controller.getReviewsProduct(mockProductId)
      expect(result).toEqual([])
    })

    it('should return a review seller empty list ', async () => {
      mockReviewService.getAll.mockResolvedValue([])

      const result = await controller.getReviewsProduct(mockSellerId)
      expect(result).toEqual([])
    })
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
})
