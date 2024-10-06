import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return an access token on successful registration', async () => {
      const result = { access_token: 'some_token' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const registerDto: RegisterUserDto = {
        address: 'test address',
        fullName: 'Test User',
        roleName: 'buyer',
        email: 'test@example.com',
        password: 'password123'
      };

      expect(await authController.register(registerDto)).toBe(result);
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const result = { access_token: 'some_token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(await authController.login(loginDto)).toBe(result);
    });

    it('should throw an error if credentials are invalid', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));

      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
