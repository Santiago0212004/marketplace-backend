import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entity/subcategory.entity';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { Category } from '../category/entity/category.entity';
import { SubcategoryDto } from './dto/subcategory.dto';

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

    async getAll(): Promise<SubcategoryDto[]> {
        try {
            const subcategories = await this.subcategoryRepository.find({ relations: ['category'] });
            return subcategories.map((subcategory): SubcategoryDto => {
                return {
                    id: subcategory.id,
                    name: subcategory.name,
                    category: subcategory.category.name
                }
            });
        } catch(error) {
            console.log(error);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving subcategories');
        }
    }

    async getByCategory(categoryId: string): Promise<SubcategoryDto[]> {
        try {
            const subcategories = await this.subcategoryRepository.find({ where: { category: { id: categoryId } }, relations: ['category'] });

            return subcategories.map((subcategory): SubcategoryDto => {
               return {
                   id: subcategory.id,
                   name: subcategory.name,
                   category: subcategory.category.name
               }
            });

        } catch(error) {
            console.log(error);
            throw new InternalServerErrorException('An unexpected error occurred while retrieving subcategories');
        }
    }

    async update(id: string, createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        const subcategory = await this.subcategoryRepository.findOne({ where: { id } });
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        const { name, categoryId } = createSubcategoryDto;
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        subcategory.name = name;
        subcategory.category = category;
        return await this.subcategoryRepository.save(subcategory);
    }

    async delete(id: string): Promise<void> {
        const subcategory = await this.subcategoryRepository.findOne({ where: { id } });
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }
        await this.subcategoryRepository.remove(subcategory);
    }
}
