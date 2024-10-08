import { Test, TestingModule } from '@nestjs/testing'; 
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/createSize.dto';
import { Size } from './entity/size.entity';
import { User } from '../user/entity/user.entity';
import { Subcategory } from '../subcategory/entity/subcategory.entity';

describe('SizeController', () => {
  let controller: SizeController;
  let service: SizeService;

  const mockSizeService = {
    create: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SizeController],
      providers: [
        {
          provide: SizeService,
          useValue: mockSizeService,
        },
      ],
    }).compile();

    controller = module.get<SizeController>(SizeController);
    service = module.get<SizeService>(SizeService);
  });

  describe('create', () => {
    const createSizeDto: CreateSizeDto = {
      name: 'L',
      productId: '9df7e0e1-1c2d-4c9c-8800-a593c697b68e',
    };

    it('should create a size successfully', async () => {
      const expectedResult: Size = {
        id: '123e4567-e89b-12d3-a456-426614174111',
        name: 'L',
        product: {
          id: createSizeDto.productId,
          name: 'Test Product',
        },
      } as Size;

      mockSizeService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createSizeDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createSizeDto);
    });
  });

  

  describe('delete', () => {
    it('should delete a size successfully', async () => {
      mockSizeService.delete.mockResolvedValue(null);

      await controller.delete('123');

      expect(service.delete).toHaveBeenCalledWith('123');
    });
  });

  describe('getAll', () => {
    it('should return all sizes', async () => {
      const expectedResult: Size[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174111',
          name: 'L',
          product: {
            id: '9df7e0e1-1c2d-4c9c-8800-a593c697b68e',
            name: 'Test Product',
            description: '',
            price: 0,
            mainImageUrl: '',
            seller: new User,
            reviews: [],
            sizes: [],
            subcategory: new Subcategory
          },
          options: []
        },
      ];

      mockSizeService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(service.getAll).toHaveBeenCalled();
    });
  });
});
