import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Category } from './entity/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    getAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Test Category',
    };

    it('should create a category successfully', async () => {
      const expectedResult: Category = {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Test Category',
        subcategories: [],
        products: [],
      } as Category;

      mockCategoryService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCategoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const expectedResult: Category[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174111',
          name: 'Test Category',
          subcategories: [],
        },
      ];

      mockCategoryService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(service.getAll).toHaveBeenCalled();
    });
  });
});
