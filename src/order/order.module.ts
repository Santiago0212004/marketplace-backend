import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OptionModule } from '../option/option.module';
import { Option } from '../option/entity/option.entity';
import { Size } from '../size/entity/size.entity';
import { Product } from '../product/entity/product.entity';
import { SizeModule } from '../size/size.module';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Option, Size, Product]), UserModule, OptionModule, SizeModule, ProductModule],
    exports: [TypeOrmModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
