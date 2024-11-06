import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entity/subcategory.entity';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { CategoryModule } from '../category/category.module';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { Category } from '../category/entity/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Subcategory, User, Category]), CategoryModule, forwardRef(()=>UserModule) ],
    exports: [TypeOrmModule],
    controllers: [SubcategoryController],
    providers: [SubcategoryService],
})
export class SubcategoryModule {}
