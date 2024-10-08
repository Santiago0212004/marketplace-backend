// src/role/role.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './entity/role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Roles('admin', 'seller', 'buyer')
    @Get()
    async getAll(): Promise<Role[]> {
        return this.roleService.getAll();
    }
}
