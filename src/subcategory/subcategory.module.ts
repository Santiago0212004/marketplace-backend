import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entity/subcategory.entity';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [TypeOrmModule.forFeature([Subcategory]), CategoryModule],
    exports: [TypeOrmModule],
    controllers: [SubcategoryController],
    providers: [SubcategoryService],
})
export class SubcategoryModule {}
