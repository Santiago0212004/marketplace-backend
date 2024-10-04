import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
