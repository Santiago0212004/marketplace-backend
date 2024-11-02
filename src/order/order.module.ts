import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OptionModule } from 'src/option/option.module';
import { Option } from 'src/option/entity/option.entity';
import { UnitModule } from 'src/unit/unit.module';
import { Unit } from 'src/unit/entity/unit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Option, Unit]), UserModule, OptionModule, UnitModule],
    exports: [TypeOrmModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
