import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Subcategory } from '../subcategory/entity/subcategory.entity';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CurrentUserService } from '../common/currentUser.service';

interface MockProduct extends Omit<Product, 'seller' | 'subcategory' | 'reviews' | 'sizes'> {
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

interface MockSubcategory extends Omit<Subcategory, 'category' | 'products'> {
  category: {
    id: string;
    name: string;
  };
  products: any[];
}

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let subcategoryRepository: Repository<Subcategory>;
  let userRepository: Repository<User>;

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  });

  const mockCurrentUserService = {
    getCurrentUserId: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepositoryFactory
        },
        {
          provide: getRepositoryToken(Subcategory),
          useFactory: mockRepositoryFactory
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepositoryFactory
        },
        {
          provide: CurrentUserService,
          useValue: mockCurrentUserService
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
    subcategoryRepository = module.get(getRepositoryToken(Subcategory));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockSellerId = '123e4567-e89b-12d3-a456-426614174222';

    const createProductDto = {
      name: 'Test Product',
      description: 'This is a test product description that is long enough',
      price: 99.99,
      mainImageUrl: 'http://test.com/image.jpg',
      subcategoryId: '123e4567-e89b-12d3-a456-426614174000'
    };

    const mockSeller: MockUser = {
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
    };

    const mockSubcategory: MockSubcategory = {
      id: createProductDto.subcategoryId,
      name: 'Test Subcategory',
      category: {
        id: '123e4567-e89b-12d3-a456-426614174333',
        name: 'Test Category'
      },
      products: []
    };

    const mockProduct: MockProduct = {
      id: '123e4567-e89b-12d3-a456-426614174111',
      ...createProductDto,
      subcategory: mockSubcategory,
      seller: mockSeller,
      reviews: [],
      sizes: []
    };

    beforeEach(() => {
      mockCurrentUserService.getCurrentUserId.mockReturnValue(mockSellerId);
    });

    it('should create a product successfully', async () => {
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(mockSubcategory as unknown as Subcategory);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockSeller as unknown as User);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productRepository, 'create').mockReturnValue(mockProduct as unknown as Product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct as unknown as Product);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw ConflictException when product name already exists', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct as unknown as Product);

      await expect(service.create(createProductDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createProductDto)).rejects.toThrow('Product with the same name already exists');
    });

    it('should throw NotFoundException when subcategory not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createProductDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createProductDto)).rejects.toThrow(`Subcategory with ID ${createProductDto.subcategoryId} not found`);
    });

    it('should throw NotFoundException when seller not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(mockSubcategory as unknown as Subcategory);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createProductDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createProductDto)).rejects.toThrow(`Seller with ID ${mockSellerId} not found`);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error('Database error'));

      await expect(service.create(createProductDto)).rejects.toThrow(InternalServerErrorException);
      await expect(service.create(createProductDto)).rejects.toThrow('An unexpected error occurred while creating the product');
    });
  });

  describe('getAll', () => {
    const mockProducts: MockProduct[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Test Product 1',
        description: 'Description 1',
        price: 99.99,
        mainImageUrl: 'http://test.com/image1.jpg',
        seller: {
          id: '123e4567-e89b-12d3-a456-426614174222',
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
        },
        subcategory: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Subcategory',
          category: {
            id: '123e4567-e89b-12d3-a456-426614174333',
            name: 'Test Category'
          },
          products: []
        },
        reviews: [],
        sizes: []
      }
    ];

    it('should return all products', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue(mockProducts as unknown as Product[]);

      const result = await service.getAll();

      expect(result).toEqual(mockProducts);
      expect(productRepository.find).toHaveBeenCalledWith({
        relations: ['seller', 'subcategory']
      });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow(InternalServerErrorException);
      await expect(service.getAll()).rejects.toThrow('An unexpected error occurred while retrieving products');
    });
  });
});