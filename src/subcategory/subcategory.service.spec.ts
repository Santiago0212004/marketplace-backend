import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryService } from './subcategory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subcategory } from './entity/subcategory.entity';
import { Category } from '../category/entity/category.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';

describe('SubcategoryService', () => {
  let service: SubcategoryService;
  let subcategoryRepository: Repository<Subcategory>;
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
        SubcategoryService,
        {
          provide: getRepositoryToken(Subcategory),
          useFactory: mockRepositoryFactory,
        },
        {
          provide: getRepositoryToken(Category),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<SubcategoryService>(SubcategoryService);
    subcategoryRepository = module.get(getRepositoryToken(Subcategory));
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  describe('create', () => {
    const createSubcategoryDto: CreateSubcategoryDto = {
      name: 'Test Subcategory',
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockCategory = {
      id: createSubcategoryDto.categoryId,
      name: 'Test Category',
    };

    const mockSubcategory = {
      id: '123e4567-e89b-12d3-a456-426614174111',
      name: createSubcategoryDto.name,
      category: mockCategory,
    };

    it('should create a subcategory successfully', async () => {
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(null); // No subcategory with same name
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory as Category); // Category exists
      jest.spyOn(subcategoryRepository, 'create').mockReturnValue(mockSubcategory as Subcategory);
      jest.spyOn(subcategoryRepository, 'save').mockResolvedValue(mockSubcategory as Subcategory);

      const result = await service.create(createSubcategoryDto);

      expect(result).toEqual(mockSubcategory);
      expect(subcategoryRepository.save).toHaveBeenCalledWith(mockSubcategory);
    });

    it('should throw ConflictException when subcategory name already exists', async () => {
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(mockSubcategory as Subcategory);

      await expect(service.create(createSubcategoryDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createSubcategoryDto)).rejects.toThrow('Subcategory with the same name already exists');
    });

    it('should throw NotFoundException when category not found', async () => {
      jest.spyOn(subcategoryRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createSubcategoryDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createSubcategoryDto)).rejects.toThrow(`Category with ID ${createSubcategoryDto.categoryId} not found`);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(subcategoryRepository, 'findOne').mockRejectedValue(new Error('Database error'));

      await expect(service.create(createSubcategoryDto)).rejects.toThrow(InternalServerErrorException);
      await expect(service.create(createSubcategoryDto)).rejects.toThrow('An unexpected error occurred while creating the subcategory');
    });
  });

  describe('getAll', () => {
    const mockSubcategories: Subcategory[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Test Subcategory',
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Category',
        },
      } as Subcategory,
    ];

    it('should return all subcategories', async () => {
      jest.spyOn(subcategoryRepository, 'find').mockResolvedValue(mockSubcategories);

      const result = await service.getAll();

      expect(result).toEqual(mockSubcategories);
      expect(subcategoryRepository.find).toHaveBeenCalledWith({
        relations: ['category'],
      });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(subcategoryRepository, 'find').mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow(InternalServerErrorException);
      await expect(service.getAll()).rejects.toThrow('An unexpected error occurred while retrieving subcategories');
    });
  });
});
