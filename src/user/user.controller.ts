import { Controller, Body, Get, Param, Delete, UseGuards, Put, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from './entity/user.entity';
import { CurrentUser } from './decorators/currentUser.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin', 'seller', 'buyer')
  @Get('me')
  getProfile(@CurrentUser() user) {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller', 'buyer')
  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Roles('admin', 'seller', 'buyer')
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Roles('admin', 'seller', 'buyer')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.userService.updateUser(id, updateData);
  }

  @Roles('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  @Roles('admin')
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }
}
