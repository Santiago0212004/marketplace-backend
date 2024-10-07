import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Role>;

  const mockRepositoryFactory = () => ({
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get(getRepositoryToken(Role));
  });

  describe('getAll', () => {
    const mockRoles: Role[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Admin',
        users: [],
      } as Role,
    ];

    it('should return all roles', async () => {
      jest.spyOn(roleRepository, 'find').mockResolvedValue(mockRoles);

      const result = await service.getAll();

      expect(result).toEqual(mockRoles);
      expect(roleRepository.find).toHaveBeenCalled();
    });

  });
});
