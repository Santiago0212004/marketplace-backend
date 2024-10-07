import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService
        }
      ]
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'This is a test product description that is long enough',
      price: 99.99,
      mainImageUrl: 'https://test.com/image.jpg',
      subcategoryId: '123e4567-e89b-12d3-a456-426614174000'
    };

    it('should create a product successfully', async () => {
      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174111',
        ...createProductDto,
        seller: {
          id: '123e4567-e89b-12d3-a456-426614174222',
          username: 'testUser'
        },
        subcategory: {
          id: createProductDto.subcategoryId,
          name: 'Test Subcategory'
        },
        reviews: [],
        orders: [],
        sizes: []
      };

      mockProductService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });
});