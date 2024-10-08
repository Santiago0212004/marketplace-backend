import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { UserModule } from '../user/user.module';
import { CurrentUserService } from '../common/currentUser.service';
@Module({
    imports: [TypeOrmModule.forFeature([Product]), SubcategoryModule, UserModule],
    providers: [ProductService, CurrentUserService],
    controllers: [ProductController],
    exports: [ProductService, CurrentUserService]
})
export class ProductModule {}
