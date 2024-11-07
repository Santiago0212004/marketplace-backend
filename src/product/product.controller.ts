import { Body, Controller, Post, UseGuards, Patch, Param, ParseUUIDPipe, Delete, Req, Get, Query} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { CurrentUserDto } from '../common/currentUser.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('create')
    @Roles('seller', 'admin')
    async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: CurrentUserDto) {
        return this.productService.create(createProductDto, user);
    }

    @Patch('update/:id')
    @Roles('seller', 'admin')
    async update(@Body() updateProduct: UpdateProductDto, @Param('id', ParseUUIDPipe) id:string, @CurrentUser() user: CurrentUserDto){
        return this.productService.update(updateProduct, id, user);
    }

    @Delete('delete/:id')
    @Roles('seller', 'admin')
    async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: CurrentUserDto){
        return this.productService.remove(id, user);
    }

    @Get('get/:id')
    @Roles('buyer', 'seller', 'admin')
    async get(@Param('id', ParseUUIDPipe) id: string){
        return this.productService.findOne(id);
    }

    @Get('all/filter')
    @Roles('buyer','seller', 'admin')
    async findAllFilter(@Query()paginationDto: PaginationDto){
        return this.productService.getAllFilter(paginationDto)
    }

    @Get('all')
    @Roles('buyer', 'seller', 'admin')
    async findAll(){
        return this.productService.getAll();
    }
    

    @Get('seller_products')
    @Roles('seller', 'admin')
    async findUserProducts(@CurrentUser() user: CurrentUserDto){
        console.log(user);
        return this.productService.getUserProducts(user);
    }
}
