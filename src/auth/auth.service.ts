import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.userService.createUser(registerUserDto);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.fullName = user.fullName;
    userDto.email = user.email;
    userDto.address = user.address;
    userDto.roleName = user.role.name;
    return {
      access_token: this.jwtService.sign(payload),
      user: userDto,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.fullName = user.fullName;
    userDto.email = user.email;
    userDto.address = user.address;
    userDto.roleName = user.role.name;

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: userDto,
    };
  }


}
