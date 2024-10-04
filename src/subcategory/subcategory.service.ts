import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entity/subcategory.entity';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Category } from '../category/entity/category.entity';

@Injectable()
export class SubcategoryService {
    constructor(
        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        const { name, categoryId } = createSubcategoryDto;

        try {
        const existingSubcategory = await this.subcategoryRepository.findOne({ where: { name } });
        if (existingSubcategory) {
            throw new ConflictException('Subcategory with the same name already exists');
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        const newSubcategory = this.subcategoryRepository.create({
            name,
            category,
        });

        return await this.subcategoryRepository.save(newSubcategory);

        } catch (error) {
        if (error instanceof ConflictException || error instanceof NotFoundException) {
            throw error;
        } else {
            throw new InternalServerErrorException('An unexpected error occurred while creating the subcategory');
        }
        }
    }

    async getAll(): Promise<Subcategory[]> {
        try {
        return await this.subcategoryRepository.find({ relations: ['category'] });
        } catch {
        throw new InternalServerErrorException('An unexpected error occurred while retrieving subcategories');
        }
    }
}
