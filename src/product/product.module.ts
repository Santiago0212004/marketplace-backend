import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { UserModule } from 'src/user/user.module';
import { CurrentUserService } from '../common/currentUser.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoryModule } from 'src/category/category.module';
import { ReviewModule } from 'src/review/review.module';
@Module({
    imports: [TypeOrmModule.forFeature([Product]), SubcategoryModule,forwardRef(() => UserModule) , PaginationDto, CategoryModule,forwardRef(() => ReviewModule)],
    providers: [ProductService, CurrentUserService],
    controllers: [ProductController],
    exports: [ProductService, CurrentUserService]
})
export class ProductModule {}
