import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Subcategory } from './entity/subcategory.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('subcategories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}
    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        return this.subcategoryService.create(createSubcategoryDto);
    }

    @Roles('admin', 'seller', 'buyer')
    @Get()
    async getAll(): Promise<Subcategory[]> {
        return this.subcategoryService.getAll();
    }
}
