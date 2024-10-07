import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Subcategory } from './entity/subcategory.entity';

describe('SubcategoryController', () => {
  let controller: SubcategoryController;
  let service: SubcategoryService;

  const mockSubcategoryService = {
    create: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoryController],
      providers: [
        {
          provide: SubcategoryService,
          useValue: mockSubcategoryService,
        },
      ],
    }).compile();

    controller = module.get<SubcategoryController>(SubcategoryController);
    service = module.get<SubcategoryService>(SubcategoryService);
  });

  describe('create', () => {
    const createSubcategoryDto: CreateSubcategoryDto = {
      name: 'Test Subcategory',
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should create a subcategory successfully', async () => {
      const expectedResult: Subcategory = {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Test Subcategory',
        category: {
          id: createSubcategoryDto.categoryId,
          name: 'Test Category',
        },
      } as Subcategory;

      mockSubcategoryService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createSubcategoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createSubcategoryDto);
    });
  });

  describe('update', () => {
    it('should update a subcategory successfully', async () => {
      const updateSubcategoryDto: CreateSubcategoryDto = {
        name: 'Updated Subcategory',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResult: Subcategory = {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'Updated Subcategory',
        category: {
          id: updateSubcategoryDto.categoryId,
          name: 'Test Category',
        },
      } as Subcategory;

      mockSubcategoryService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('123', updateSubcategoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith('123', updateSubcategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a subcategory successfully', async () => {
      mockSubcategoryService.delete.mockResolvedValue(null);

      await controller.delete('123');

      expect(service.delete).toHaveBeenCalledWith('123');
    });
  });

  describe('getAll', () => {
    it('should return all subcategories', async () => {
      const expectedResult: Subcategory[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174111',
          name: 'Test Subcategory',
          category: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Test Category',
            subcategories: [],
          },
          products: [],
        },
      ];

      mockSubcategoryService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(service.getAll).toHaveBeenCalled();
    });
  });
});
