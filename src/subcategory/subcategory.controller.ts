import { Body, Controller, Post, Get, Delete, Param, UseGuards, Put } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Subcategory } from './entity/subcategory.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SubcategoryDto } from './dto/subcategory.dto';

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
    @Get('all')
    async getAll(): Promise<SubcategoryDto[]> {
        return this.subcategoryService.getAll();
    }

    @Roles('admin', 'seller', 'buyer')
    @Get(':categoryId')
    async getByCategory(@Param('categoryId') categoryId: string): Promise<SubcategoryDto[]> {
        return this.subcategoryService.getByCategory(categoryId);
    }

    @Roles('admin', 'seller')
    @Put(':id')
    async update(@Param('id') id: string, @Body() createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        return this.subcategoryService.update(id, createSubcategoryDto);
    }

    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.subcategoryService.delete(id);
    }
}
