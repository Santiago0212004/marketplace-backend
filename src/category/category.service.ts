import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
    const existingCategory = await this.categoryRepository.findOne({ where: { name } });
    if (existingCategory) {
      throw new ConflictException('Category with the same name already exists');
    }
    const newCategory = this.categoryRepository.create({ name });
    return this.categoryRepository.save(newCategory);
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async update(id: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = createCategoryDto.name;
    return await this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
  }
}
