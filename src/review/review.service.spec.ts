import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/entity/user.entity';
import { Review } from './entity/review.entity';
import { ReviewSeller } from './entity/reviewSeller.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { NotFoundException } from '@nestjs/common';

interface MockProduct extends Omit<Product, 'seller' | 'subcategory' | 'reviews' | 'orders' | 'sizes'> {
  seller: MockUser;
  subcategory: MockSubcategory;
  reviews: any[];
  sizes: any[];
}

interface MockUser extends Omit<User, 'role' | 'products' | 'orders' | 'reviews'> {
  role: {
    id: string;
    name: string;
  };
  products: any[];
  orders: any[];
  reviews: any[];
}

interface MockReview extends Omit<Review, 'rating' | 'comment' | 'product'> {
  rating: number;
  comment: string;
  product: MockProduct;
}
interface MockReviewSeller extends Omit<ReviewSeller, 'rating' | 'comment' | 'buyer'> {
  rating: number;
  comment: string;
  buyer: MockUser;
}
interface MockSubcategory extends Omit<Subcategory, 'category' | 'products'> {
  category: {
    id: string;
    name: string;
  };
  products: any[];
}

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: Repository<Review>
  let reviewSellerRepository: Repository<ReviewSeller>

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn()
  });
  
  const mockProductService = {
    findOne: jest.fn()
  }
  
  const mockUserService = {
    findById: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,
        {
          provide: getRepositoryToken(Review),
          useFactory: mockRepositoryFactory
        },
        {
          provide: getRepositoryToken(ReviewSeller),
          useFactory: mockRepositoryFactory
        },
        {
          provide: ProductService,
          useValue: mockProductService
        },
        {
          provide: UserService,
          useValue: mockUserService
        }
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get(getRepositoryToken(Review))
    reviewSellerRepository = module.get(getRepositoryToken(ReviewSeller))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create reviews', () => {
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

    const mockSubcategory: MockSubcategory = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Subcategory',
      category: {
        id: '123e4567-e89b-12d3-a456-426614174333',
        name: 'Test Category'
      },
      products: []
    };

    const mockUser: MockUser = {
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
    
    const mockProduct: MockProduct = {
      id: mockProductId,
      name: 'Test Product',
      description: 'This is a test product description that is long enough',
      price: 99.99,
      mainImageUrl: 'http://test.com/image.jpg',
      seller: mockUser,
      reviews: [],
      sizes: [],
      subcategory: mockSubcategory
    }

    const mockReview: MockReview = {
      id: '123e4567-e89b-12d3-a456-426614174555',
      rating: 3,
      comment: 'This a review comment test',
      product: mockProduct
    }

    const mockReviewSeller: MockReviewSeller = {
      id: '123e4567-e89b-12d3-a456-426614174666',
      rating: 2,
      comment: 'This a seller review comment test',
      buyer: mockUser
    }

    const mockReviewList: MockReview[] = [mockReview]
    const mockReviewSellerList: MockReviewSeller[] = [mockReviewSeller]

    it('should create a review for product successfully', async () => {
      mockProductService.findOne.mockReturnValue(mockProduct)
      jest.spyOn(reviewRepository, 'create').mockReturnValue(mockReview as unknown as Review);
      jest.spyOn(reviewRepository, 'save').mockResolvedValue(mockReview as unknown as Review);

      const resultProduct = await service.create(createReviewDto,"product")
      expect(resultProduct).toEqual(mockReview);
    })

    it('should create a review for seller successfully', async () => {
      mockUserService.findById.mockReturnValue(mockUser)
      jest.spyOn(reviewSellerRepository, 'create').mockReturnValue(mockReviewSeller as unknown as ReviewSeller);
      jest.spyOn(reviewSellerRepository, 'save').mockResolvedValue(mockReviewSeller as unknown as ReviewSeller);

      const resultSeller = await service.create(createReviewDto,"seller")
      expect(resultSeller).toEqual(mockReviewSeller);
    })

    it('should throw a NotFoundException when product does not exist with this id', async () =>{
      mockProductService.findOne.mockReturnValue(null)
      const creationReviewBadDto = {
        rating: 3,
        comment: 'This a review comment test',
        id: "5"
      }

      await expect(service.create(creationReviewBadDto,'product')).rejects.toThrow(NotFoundException)
      await expect(service.create(creationReviewBadDto,'product')).rejects.toThrow(`Product with id 5 not found`)
      
    })

    it('should throw a NotFoundException when seller does not exist with this id', async () =>{
      mockUserService.findById.mockReturnValue(null)
      const creationReviewSBadDto = {
        rating: 3,
        comment: 'This a review comment test',
        id: "5"
      }

      await expect( service.create(creationReviewSBadDto,"seller")).rejects.toThrow(NotFoundException)
      await expect( service.create(creationReviewSBadDto,"product")).rejects.toThrow(`Product with id 5 not found`)
    })

    it('should return a list of product reviews when there is at least one item', async () =>{
      
      jest.spyOn(reviewRepository,'find').mockResolvedValue(mockReviewList as unknown as Review[])
      expect(await service.getAll(mockProductId,"product")).toContainEqual(mockReview)
    })

    it('should return an empty list of product reviews when there is at least one item', async () =>{
      
      jest.spyOn(reviewRepository,'find').mockResolvedValue([])
      expect(await service.getAll("5","product")).toEqual([])
    })

    it('should return a list of seller reviews when there is at least one item', async () =>{
      
      jest.spyOn(reviewSellerRepository,'find').mockResolvedValue(mockReviewSellerList as unknown as ReviewSeller[])
      expect(await service.getAll(mockSellerId,"seller")).toContainEqual(mockReviewSeller)
    })

    it('should return an empty list of seller reviews when there is at least one item', async () =>{
      
      jest.spyOn(reviewSellerRepository,'find').mockResolvedValue([])
      expect(await service.getAll("5","seller")).toEqual([])
    })
  })
});
