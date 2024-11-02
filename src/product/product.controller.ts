import { Body, Controller, Post, UseGuards, Patch, Param, ParseUUIDPipe, Delete, Req, Get, Query} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUser } from '../user/decorators/currentUser.decorator';

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('create')
    @Roles('seller', 'admin')
    async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user) {
        return this.productService.create(createProductDto, user);
    }

    @Patch('update/:id')
    @Roles('seller', 'admin')
    async update(@Body() updateProduct: CreateProductDto, @Param('id', ParseUUIDPipe) id:string){
        return this.productService.update(updateProduct, id)
    }

    @Delete('delete/:id')
    @Roles('seller', 'admin')
    async remove(@Param('id', ParseUUIDPipe) id:string){
        return this.productService.remove(id)
    }

    @Get('all')
    @Roles('seller', 'admin')
    async findAll(@Query()paginationDto: PaginationDto){
        return this.productService.getAll(paginationDto)
    }
}
