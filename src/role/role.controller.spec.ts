import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entity/role.entity';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRoleService = {
    getAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  describe('getAll', () => {
    it('should return all roles', async () => {
      const expectedResult: Role[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Admin',
          users: [],
        },
      ];

      mockRoleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(result).toEqual(expectedResult);
      expect(service.getAll).toHaveBeenCalled();
    });
  });
});
