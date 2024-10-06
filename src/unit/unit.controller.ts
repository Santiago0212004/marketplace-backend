import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/createUnit.dto';
import { Unit } from './entity/unit.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnitController {
    constructor(private readonly unitService: UnitService) {}

    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
        return this.unitService.create(createUnitDto);
    }

    @Roles('admin', 'seller', 'buyer')
    @Get()
    async getAll(): Promise<Unit[]> {
        return this.unitService.getAll();
    }

    @Roles('admin', 'seller', 'buyer')
    @Get(':id')
    async getUnitByOptionId(@Param('id') optionId: string): Promise<Unit[]> {
        return this.unitService.getUnitByOptionId(optionId);
    }
}