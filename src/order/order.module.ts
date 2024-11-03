import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OptionModule } from 'src/option/option.module';
import { Option } from 'src/option/entity/option.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Option]), UserModule, OptionModule],
    exports: [TypeOrmModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
