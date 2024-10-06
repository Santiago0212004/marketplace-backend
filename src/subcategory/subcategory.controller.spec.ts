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
