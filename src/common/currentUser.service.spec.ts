import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserService } from './currentUser.service';
import { REQUEST } from '@nestjs/core';

describe('CurrentUserService', () => {
  let service: CurrentUserService;

  const mockRequest = {
    user: {
      sub: '1234567890',
      email: 'user@test.com',
      role: 'admin',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrentUserService,
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = module.get<CurrentUserService>(CurrentUserService);
  });

  it('should return the current user id', () => {
    const userId = service.getCurrentUserId();
    expect(userId).toBe(mockRequest.user.sub);
  });

  it('should return the current user role', () => {
    const userRole = service.getCurrentUserRole();
    expect(userRole).toBe(mockRequest.user.role);
  });
});
