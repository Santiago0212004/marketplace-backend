import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Role } from '../role/entity/role.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: '7bf172f3-c445-4ab4-9407-5f26ffabe4c0',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    address: '123 Main St',
    role: {
      id: '90c16e51-d59b-40a3-9d45-ed7aa7d743ff',
      name: 'buyer',
      users: [],
    } as Role,
    products: [],
    orders: [],
    reviews: [],
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockRegisterUserDto: RegisterUserDto = {
      fullName: 'New User',
      email: 'test@example.com',
      password: 'Password123!',
      address: '456 Another St',
      roleName: 'buyer',
    };

    const mockRole = {
      id: '90c16e51-d59b-40a3-9d45-ed7aa7d743ff',
      name: 'buyer',
      users: [],
    };

    it('should create and return a new user', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(undefined);
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      const hashedPassword = await bcrypt.hash(mockRegisterUserDto.password, 10);
      const savedUser = { ...mockUser, ...mockRegisterUserDto, password: hashedPassword, role: mockRole };
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await userService.createUser(mockRegisterUserDto);

      expect(result).toEqual(savedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: mockRegisterUserDto.email } });
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { name: mockRegisterUserDto.roleName } });
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      await expect(userService.createUser(mockRegisterUserDto)).rejects.toThrow(ConflictException);

      expect(mockRoleRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if role is not found', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(undefined);
      mockRoleRepository.findOne.mockResolvedValueOnce(undefined);
      await expect(userService.createUser(mockRegisterUserDto)).rejects.toThrow(NotFoundException);

      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { name: mockRegisterUserDto.roleName } });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await userService.findById('7bf172f3-c445-4ab4-9407-5f26ffabe4c0');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '7bf172f3-c445-4ab4-9407-5f26ffabe4c0' },
        relations: ['role']
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(userService.findById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await userService.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['role']
      });
    });
    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(userService.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);
    });
  });


  describe('updateUser', () => {
    it('should update and return the user', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockUserRepository.update.mockResolvedValue(null);
      const updatedUser = { ...mockUser, fullName: 'Updated Name' };
      mockUserRepository.findOne.mockResolvedValueOnce(updatedUser);
      const result = await userService.updateUser('7bf172f3-c445-4ab4-9407-5f26ffabe4c0', { fullName: 'Updated Name' });

      expect(result.fullName).toEqual('Updated Name');
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, { fullName: 'Updated Name' });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(userService.updateUser('nonexistent-id', { fullName: 'Updated Name' })).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'nonexistent-id' } });
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user if it exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(null);
      await userService.deleteUser(mockUser.id);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id }});
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(userService.deleteUser('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'nonexistent-id' }});
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);
      const result = await userService.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });
});
