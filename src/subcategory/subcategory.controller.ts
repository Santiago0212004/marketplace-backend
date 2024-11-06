import { Body, Controller, Post, Get, Delete, Param, UseGuards, Put } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Subcategory } from './entity/subcategory.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SubcategoryDto } from './dto/subcategory.dto';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { CurrentUserDto } from '../common/currentUser.dto';

@Controller('subcategories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}

    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() createSubcategoryDto: CreateSubcategoryDto, @CurrentUser() user: CurrentUserDto): Promise<Subcategory> {
        return this.subcategoryService.create(createSubcategoryDto, user);
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

    @Roles('admin', 'seller', 'buyer')
    @Get('mine/:categoryId')
    async getMyByCategory(@Param('categoryId') categoryId: string, @CurrentUser() user: CurrentUserDto): Promise<SubcategoryDto[]> {
        return this.subcategoryService.getMineByCategory(categoryId, user);
    }

    @Roles('admin', 'seller')
    @Put(':id')
    async update(@Param('id') id: string, @Body() createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        return this.subcategoryService.update(id, createSubcategoryDto);
    }

    @Roles('admin', 'seller')
    @Delete('delete/:id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.subcategoryService.delete(id);
    }
}
