import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './entity/user.entity';
import { Role } from '../role/entity/role.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  const mockUser: User = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    address: '123 Main St',
    role: {
      id: '1',
      name: 'buyer',
      users: [],
    } as Role,
    products: [],
    orders: [],
    reviews: [],
  };

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

      expect(await userController.getUserById('57c68de4-dad0-4b03-9b2c-5b491c3645bb')).toBe(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      expect(await userController.getUserByEmail('test@example.com')).toBe(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updatedUser = { ...mockUser, fullName: 'Updated User' };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser);

      const updateData = { fullName: 'Updated User' };
      expect(await userController.updateUser('57c68de4-dad0-4b03-9b2c-5b491c3645bb', updateData)).toBe(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a success message', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue();

      expect(await userController.deleteUser('57c68de4-dad0-4b03-9b2c-5b491c3645bb')).toEqual({ message: 'User deleted successfully' });
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(userService, 'findAll').mockResolvedValue(users);

      expect(await userController.getAllUsers()).toBe(users);
    });
  });
});
