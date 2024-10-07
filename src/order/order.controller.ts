import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('create')
    @Roles('buyer')
    async create(@Body() createProductDto: CreateOrderDto) {
        return this.orderService.create(createProductDto);
    }
}
