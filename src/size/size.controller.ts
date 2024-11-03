import { Body, Controller, Post, Get, UseGuards, Param, Delete} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/createSize.dto';
import { Size } from './entity/size.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { CurrentUserDto } from '../common/currentUser.dto';
import { SizeDto } from './dto/size.dto';

@Controller('sizes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SizeController {
    constructor(private readonly sizeService: SizeService) {}
    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() CreateSizeDto: CreateSizeDto): Promise<Size> {
        return this.sizeService.create(CreateSizeDto);
    }

    @Roles('admin', 'seller', 'buyer')
    @Get('all')
    async getAll(): Promise<SizeDto[]> {
        return this.sizeService.getAll();
    }

    @Roles('admin', 'seller', 'buyer')
    @Get('product/:id')
    async getSizesByProductId(@Param('id') productId: string): Promise <SizeDto[]> {
        return this.sizeService.getSizesByProductId(productId);
    }

    @Delete('delete/:id')
    @Roles('admin', 'seller')
    async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
        return this.sizeService.delete(id, user);
    }
}
