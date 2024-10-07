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
    update: jest.fn(),
    delete: jest.fn(),
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
      name: 'New Category',
    };

    it('should create a category successfully', async () => {
      const mockCategory = { id: '1', name: 'New Category' };
      mockCategoryService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ id: '1', name: 'Test Category' }];
      mockCategoryService.getAll.mockResolvedValue(mockCategories);

      const result = await controller.getAll();
      expect(result).toEqual(mockCategories);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateCategoryDto: CreateCategoryDto = {
      name: 'Updated Category',
    };

    it('should update a category successfully', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Updated Category',
        subcategories: [],
        products: [],
      } as Category;

      mockCategoryService.update.mockResolvedValue(mockCategory);

      const result = await controller.update(mockCategory.id, updateCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(service.update).toHaveBeenCalledWith(mockCategory.id, updateCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      const mockCategoryId = '1';
      mockCategoryService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(mockCategoryId);
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(mockCategoryId);
    });
  });
});
