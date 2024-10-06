import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { Role } from '../role/entity/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { fullName, email, password, address, roleName } = registerUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new NotFoundException(`Role named ${roleName} not found`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      address,
      role,
    });

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: ['role'] });
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] } );
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.update(user.id, updateData);

    return await this.userRepository.findOne({ where: { id: user.id } });
  }


  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.delete(user.id);
  }
}
