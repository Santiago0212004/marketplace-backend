import { Test, TestingModule } from '@nestjs/testing';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/createUnit.dto';
import { Unit } from './entity/unit.entity';

describe('UnitController', () => {
  let controller: UnitController;
  let service: UnitService;

  const mockUnitService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getUnitByOptionId: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [
        {
          provide: UnitService,
          useValue: mockUnitService,
        },
      ],
    }).compile();

    controller = module.get<UnitController>(UnitController);
    service = module.get<UnitService>(UnitService);
  });

  describe('create', () => {
    const createUnitDto: CreateUnitDto = { sold: false, optionId: 'option-id' };
    const mockUnit: Unit = { id: 'unit-id', sold: false, option: null };

    it('should create a unit', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockUnit);

      const result = await controller.create(createUnitDto);

      expect(result).toEqual(mockUnit);
      expect(service.create).toHaveBeenCalledWith(createUnitDto);
    });
  });

  describe('getAll', () => {
    const mockUnits: Unit[] = [
      { id: 'unit-id', sold: false, option: null },
    ];

    it('should return all units', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(mockUnits);

      const result = await controller.getAll();

      expect(result).toEqual(mockUnits);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getUnitByOptionId', () => {
    const optionId = 'option-id';
    const mockUnits: Unit[] = [
      { id: 'unit-id', sold: false, option: null },
    ];

    it('should return units by option id', async () => {
      jest.spyOn(service, 'getUnitByOptionId').mockResolvedValue(mockUnits);

      const result = await controller.getUnitByOptionId(optionId);

      expect(result).toEqual(mockUnits);
      expect(service.getUnitByOptionId).toHaveBeenCalledWith(optionId);
    });
  });

  describe('delete', () => {
    const unitId = 'unit-id';

    it('should delete a unit', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(unitId);

      expect(service.delete).toHaveBeenCalledWith(unitId);
    });
  });
});
