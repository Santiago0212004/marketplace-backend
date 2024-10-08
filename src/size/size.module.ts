import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entity/size.entity';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { Product } from 'src/product/entity/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
    imports: [TypeOrmModule.forFeature([Size, Product]),ProductModule],
    exports: [TypeOrmModule],
    controllers: [SizeController],
    providers: [SizeService],
})
export class SizeModule {}
