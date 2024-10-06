import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Test Category',
    };

    const mockCategory = {
      id: '123e4567-e89b-12d3-a456-426614174111',
      name: 'Test Category',
    };

    it('should create a category successfully', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null); // No category with the same name
      jest.spyOn(categoryRepository, 'create').mockReturnValue(mockCategory as Category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory as Category);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw ConflictException when category name already exists', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory as Category);

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createCategoryDto)).rejects.toThrow('Category with the same name already exists');
    });

  });

  describe('getAll', () => {
    const mockCategories: Category[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Test Category',
        subcategories: [],
        products: [],
      } as Category,
    ];

    it('should return all categories', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories);

      const result = await service.getAll();

      expect(result).toEqual(mockCategories);
      expect(categoryRepository.find).toHaveBeenCalled();
    });

  });
});
