import { Body, Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Get, Param } from '@nestjs/common';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('create')
    @Roles('buyer', 'admin')
    async create(@Body() createProductDto: CreateOrderDto, @Request() req) {
        return this.orderService.create(createProductDto,req);
    }

    @Delete(':id')
    @Roles('admin')
    async delete(@Param('id') id: string) {
        return this.orderService.delete(id);
    }

    @Get()
    @Roles('admin')
    async getAll() {
        return this.orderService.getAll();
    }

    @Get('seller/:sellerId')
    @Roles('seller', 'admin')
    async getOrdersBySeller(@Param('sellerId') sellerId: string) {
        return this.orderService.getOrdersBySeller(sellerId);
    }

    @Get('buyer/:buyerId')
    @Roles('buyer', 'admin')
    async getOrdersByBuyer(@Param('buyerId') buyerId: string) {
        return this.orderService.getOrdersByBuyer(buyerId);
    }
}
