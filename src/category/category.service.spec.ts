import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
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

    it('should create a category successfully', async () => {
      const mockCategory = { id: '1', name: 'Test Category' };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null); // No existe la categoría
      jest.spyOn(categoryRepository, 'create').mockReturnValue(mockCategory as Category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory as Category);

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(categoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw ConflictException if category exists', async () => {
      const existingCategory = { id: '1', name: 'Test Category' };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(existingCategory as Category);

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ id: '1', name: 'Test Category' }];
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories as Category[]);

      const result = await service.getAll();
      expect(result).toEqual(mockCategories);
      expect(categoryRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateCategoryDto: CreateCategoryDto = {
      name: 'Updated Category',
    };

    const mockCategory = { id: '1', name: 'Test Category' };

    it('should update a category successfully', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory as Category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue({
        ...mockCategory,
        name: updateCategoryDto.name,
      } as Category);

      const result = await service.update(mockCategory.id, updateCategoryDto);
      expect(result.name).toEqual(updateCategoryDto.name);
      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('non-existing-id', updateCategoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const mockCategory = { id: '1', name: 'Test Category' };

    it('should delete a category successfully', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory as Category);
      jest.spyOn(categoryRepository, 'remove').mockResolvedValue(null);

      await service.delete(mockCategory.id);
      expect(categoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete('non-existing-id')).rejects.toThrow(NotFoundException);
    });
  });
});