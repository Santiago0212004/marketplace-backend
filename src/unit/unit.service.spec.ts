import { Test, TestingModule } from '@nestjs/testing';
import { UnitService } from './unit.service';
import { Unit } from './entity/unit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from '../option/entity/option.entity';
import { NotFoundException } from '@nestjs/common';

describe('UnitService', () => {
  let service: UnitService;
  let unitRepository: Repository<Unit>;
  let optionRepository: Repository<Option>;

  const mockUnitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockOptionRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        {
          provide: getRepositoryToken(Unit),
          useValue: mockUnitRepository,
        },
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
      ],
    }).compile();

    service = module.get<UnitService>(UnitService);
    unitRepository = module.get(getRepositoryToken(Unit));
    optionRepository = module.get(getRepositoryToken(Option));
  });

  describe('create', () => {
    const createUnitDto = { sold: false, optionId: 'option-id' };
    const mockOption = { id: 'option-id' } as Option;
    const mockUnit = { id: 'unit-id', sold: false, option: mockOption } as Unit;

    it('should create a unit', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(mockOption);
      jest.spyOn(unitRepository, 'create').mockReturnValue(mockUnit);
      jest.spyOn(unitRepository, 'save').mockResolvedValue(mockUnit);

      const result = await service.create(createUnitDto);

      expect(result).toEqual(mockUnit);
      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { id: createUnitDto.optionId } });
      expect(unitRepository.create).toHaveBeenCalledWith({ sold: createUnitDto.sold, option: mockOption });
      expect(unitRepository.save).toHaveBeenCalledWith(mockUnit);
    });

    it('should throw NotFoundException if option not found', async () => {
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createUnitDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    const mockUnits: Unit[] = [{ id: 'unit-id', sold: false, option: null }];

    it('should return all units', async () => {
      jest.spyOn(unitRepository, 'find').mockResolvedValue(mockUnits);

      const result = await service.getAll();

      expect(result).toEqual(mockUnits);
      expect(unitRepository.find).toHaveBeenCalledWith({ relations: ['option'] });
    });
  });

  describe('getUnitByOptionId', () => {
    const optionId = 'option-id';
    const mockUnits: Unit[] = [{ id: 'unit-id', sold: false, option: null }];

    it('should return units by option id', async () => {
      jest.spyOn(unitRepository, 'find').mockResolvedValue(mockUnits);

      const result = await service.getUnitByOptionId(optionId);

      expect(result).toEqual(mockUnits);
      expect(unitRepository.find).toHaveBeenCalledWith({ where: { option: { id: optionId } } });
    });
  });

  describe('delete', () => {
    const unitId = 'unit-id';
    const mockUnit = { id: unitId } as Unit;

    it('should delete a unit', async () => {
      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(mockUnit);
      jest.spyOn(unitRepository, 'delete').mockResolvedValue(undefined);

      await service.delete(unitId);

      expect(unitRepository.findOne).toHaveBeenCalledWith({ where: { id: unitId } });
      expect(unitRepository.delete).toHaveBeenCalledWith(unitId);
    });

    it('should throw NotFoundException if unit not found', async () => {
      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(unitId)).rejects.toThrow(NotFoundException);
    });
  });
});
