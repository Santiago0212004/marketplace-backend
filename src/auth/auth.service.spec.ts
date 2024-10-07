import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a user and return an access token', async () => {
      const result = { access_token: 'some_token' };

      jest.spyOn(jwtService, 'sign').mockReturnValue(result.access_token);

      jest.spyOn(userService, 'createUser').mockResolvedValue({
        id: '78d2b0fb-d92e-48c3-8134-185a1bfbdb94',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        fullName: 'Test User',
        address: '123 Main St',
        products: [],
        orders: [],
        reviews: [],
        role: {
          name: 'buyer',
          id: '',
          users: [],
        },
      });

      const registerDto: RegisterUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        address: '123 Main St',
        roleName: 'buyer',
      };

      expect(await authService.register(registerDto)).toEqual(result);
    });
  });

  describe('login', () => {
    it('should validate user credentials and return an access token', async () => {
      const user = {
        id: '78d2b0fb-d92e-48c3-8134-185a1bfbdb94',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        fullName: 'Test User',
        address: '123 Main St',
        products: [],
        orders: [],
        reviews: [],
        role: {
          name: 'buyer',
          id: '',
          users: [],
        },
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('some_token');

      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      expect(await authService.login(loginDto)).toEqual({ access_token: 'some_token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const loginDto: LoginUserDto = {
        email: 'invalid@example.com',
        password: 'wrong_password',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: '78d2b0fb-d92e-48c3-8134-185a1bfbdb94',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        fullName: 'Test User',
        address: '123 Main St',
        products: [],
        orders: [],
        reviews: [],
        role: {
          name: 'buyer',
          id: '',
          users: [],
        },
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);


      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});