import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';

@Controller('product')
export class ProductController {
    @Post('create')
    async create(@Body() createProductDto: CreateProductDto) {
        return 'Product created';
    }
}
