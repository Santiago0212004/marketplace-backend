import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('create')
    @Roles('seller', 'admin')
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }
}
