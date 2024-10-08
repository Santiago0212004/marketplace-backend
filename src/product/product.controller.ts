import { Body, Controller, Post, UseGuards, Patch, Param, ParseUUIDPipe, Delete, Req, Get} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @Roles('seller', 'admin')
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Patch(':id')
    @Roles('seller', 'admin')
    async update(@Body() updateProduct: CreateProductDto, @Param('id', ParseUUIDPipe) id:string){
        return this.productService.update(updateProduct, id)
    }

    @Delete(':id')
    @Roles('seller', 'admin')
    async remove(@Param('id', ParseUUIDPipe) id:string){
        return this.productService.remove(id)
    }

    @Get('seller')
    @Roles('seller', 'admin')
    async findAll(){
        return this.productService.getAll()
    }
}
