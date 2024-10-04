import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    exports: [TypeOrmModule],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
