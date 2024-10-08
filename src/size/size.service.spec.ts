import { Test, TestingModule } from '@nestjs/testing';
import { SizeService } from './size.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Size } from './entity/size.entity';
import { Product } from '../product/entity/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SizeService', () => {
  let service: SizeService;
  let sizeRepository: Repository<Size>;
  let productRepository: Repository<Product>;

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
        SizeService,
        {
          provide: getRepositoryToken(Size),
          useFactory: mockRepositoryFactory,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<SizeService>(SizeService);
    sizeRepository = module.get(getRepositoryToken(Size));
    productRepository = module.get(getRepositoryToken(Product));
  });

  describe('create', () => {
    const mockProduct = {
      id: 'product-id',
      name: 'Test Product',
    };

    const mockSize = {
      id: 'size-id',
      name: 'Test Size',
      product: mockProduct,
    };

    const createSizeDto = {
      name: 'Test Size',
      productId: 'product-id',
    };

    it('should create a size successfully', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct as Product);
      jest.spyOn(sizeRepository, 'create').mockReturnValue(mockSize as Size);
      jest.spyOn(sizeRepository, 'save').mockResolvedValue(mockSize as Size);

      const result = await service.create(createSizeDto);

      expect(result).toEqual(mockSize);
      expect(sizeRepository.save).toHaveBeenCalledWith(mockSize);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createSizeDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createSizeDto)).rejects.toThrow('Product with ID product-id not found');
    });
  });
});
