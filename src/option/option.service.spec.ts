import { Test, TestingModule } from '@nestjs/testing';
import { OptionService } from './option.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Option } from './entity/option.entity';
import { CreateOptionDto } from './dto/createOption.dto';
import { Size } from '../size/entity/size.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Product } from '../product/entity/product.entity';

describe('OptionService', () => {
  let service: OptionService;
  let optionRepository: Repository<Option>;
  let sizeRepository: Repository<Size>;

  const mockOptionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockSizeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionService,
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(Size),
          useValue: mockSizeRepository,
        },
      ],
    }).compile();

    service = module.get<OptionService>(OptionService);
    optionRepository = module.get(getRepositoryToken(Option));
    sizeRepository = module.get(getRepositoryToken(Size));
  });

  describe('create', () => {
    const createOptionDto: CreateOptionDto = { description: 'Option 1', imageUrl: 'http://image.url', sizeId: 'size-id' };
    const mockOption: Option = {
      id: 'option-id', description: 'Option 1', imageUrl: 'http://image.url', size: null,
      orders: [],
      units: []
    };

    it('should create an option', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(sizeRepository, 'findOne').mockResolvedValue({ id: 'size-id' } as Size);
      jest.spyOn(optionRepository, 'create').mockReturnValue(mockOption);
      jest.spyOn(optionRepository, 'save').mockResolvedValue(mockOption);

      const result = await service.create(createOptionDto);

      expect(result).toEqual(mockOption);
      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { description: createOptionDto.description } });
      expect(sizeRepository.findOne).toHaveBeenCalledWith({ where: { id: createOptionDto.sizeId } });
      expect(optionRepository.create).toHaveBeenCalledWith({
        description: createOptionDto.description,
        imageUrl: createOptionDto.imageUrl,
        size: { id: createOptionDto.sizeId } // Mocked size object
      });
      expect(optionRepository.save).toHaveBeenCalledWith(mockOption);
    });

    it('should throw ConflictException if option already exists', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(mockOption);

      await expect(service.create(createOptionDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if size not found', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(sizeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createOptionDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    const mockOptions: Option[] = [{
      id: 'option-id', description: 'Option 1', imageUrl: 'http://image.url', size: null,
      orders: [],
      units: []
    }];

    it('should return all options', async () => {
      jest.spyOn(optionRepository, 'find').mockResolvedValue(mockOptions);

      const result = await service.getAll();

      expect(result).toEqual(mockOptions);
      expect(optionRepository.find).toHaveBeenCalledWith({ relations: ['size'] });
    });
  });

  describe('getOptionsBySize', () => {
    const sizeId = 'size-id';
    const mockOptions: Option[] = [{
      id: 'option-id', description: 'Option 1', imageUrl: 'http://image.url', size: {
        id: sizeId,
        name: '',
        product: new Product,
        options: []
      },
      orders: [],
      units: []
    }];

    it('should return options by size', async () => {
      jest.spyOn(optionRepository, 'find').mockResolvedValue(mockOptions);

      const result = await service.getOptionsBySize(sizeId);

      expect(result).toEqual(mockOptions);
      expect(optionRepository.find).toHaveBeenCalledWith({ where: { size: { id: sizeId } } });
    });
  });

  describe('delete', () => {
    const optionId = 'option-id';
    const mockOption = { id: optionId } as Option;

    it('should delete an option', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(mockOption);
      jest.spyOn(optionRepository, 'delete').mockResolvedValue(undefined);

      await service.delete(optionId);

      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { id: optionId } });
      expect(optionRepository.delete).toHaveBeenCalledWith(optionId);
    });

    it('should throw NotFoundException if option not found', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(optionId)).rejects.toThrow(NotFoundException);
    });
  });
});
