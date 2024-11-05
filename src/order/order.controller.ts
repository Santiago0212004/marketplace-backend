import { Body, Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Get, Param } from '@nestjs/common';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { CurrentUserDto } from '../common/currentUser.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('create')
    @Roles('buyer', 'admin')
    async create(@Body() createProductDto: CreateOrderDto, @CurrentUser() user: CurrentUserDto) {
        return this.orderService.create(createProductDto, user);
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

    @Get('seller_orders')
    @Roles('seller', 'admin')
    async getOrdersBySeller(@CurrentUser() user: CurrentUserDto) {
        return this.orderService.getOrdersBySeller(user);
    }

    @Get('buyer_orders')
    @Roles('buyer', 'admin')
    async getOrdersByBuyer(@CurrentUser() user: CurrentUserDto) {
        return this.orderService.getOrdersByBuyer(user);
    }
}
