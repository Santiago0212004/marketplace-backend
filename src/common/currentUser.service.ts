import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

interface RequestWithUser extends Request {
    user: {
      sub: string;
      email: string;
      role: string;
    }
  }

@Injectable()
export class CurrentUserService {
  constructor(@Inject(REQUEST) private readonly request: RequestWithUser) {}

  getCurrentUserId(): string {
    return this.request.user.sub;
  }

  getCurrentUserRole(): string {
    return this.request.user.role;
  }
}