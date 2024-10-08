import { Test, TestingModule } from '@nestjs/testing';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/createOption.dto';
import { Option } from './entity/option.entity';
import { Product } from '../product/entity/product.entity';

describe('OptionController', () => {
  let controller: OptionController;
  let service: OptionService;

  const mockOptionService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getOptionsBySize: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [
        {
          provide: OptionService,
          useValue: mockOptionService,
        },
      ],
    }).compile();

    controller = module.get<OptionController>(OptionController);
    service = module.get<OptionService>(OptionService);
  });

  describe('create', () => {
    const createOptionDto: CreateOptionDto = { description: 'Option 1', imageUrl: 'http://image.url', sizeId: 'size-id' };
    const mockOption: Option = {
      id: 'option-id', description: 'Option 1', imageUrl: 'http://image.url', size: null,
      orders: [],
      units: []
    };

    it('should create an option', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockOption);

      const result = await controller.create(createOptionDto);

      expect(result).toEqual(mockOption);
      expect(service.create).toHaveBeenCalledWith(createOptionDto);
    });
  });

  describe('getAll', () => {
    const mockOptions: Option[] = [{
      id: 'option-id', description: 'Option 1', imageUrl: 'http://image.url', size: null,
      orders: [],
      units: []
    }];

    it('should return all options', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(mockOptions);

      const result = await controller.getAll();

      expect(result).toEqual(mockOptions);
      expect(service.getAll).toHaveBeenCalled();
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
      jest.spyOn(service, 'getOptionsBySize').mockResolvedValue(mockOptions);

      const result = await controller.getOptionsBySize(sizeId);

      expect(result).toEqual(mockOptions);
      expect(service.getOptionsBySize).toHaveBeenCalledWith(sizeId);
    });
  });

  describe('delete', () => {
    const optionId = 'option-id';

    it('should delete an option', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(optionId);

      expect(service.delete).toHaveBeenCalledWith(optionId);
    });
  });
});
