import { Body, Controller, Post, Get, UseGuards, Param, Delete, Put } from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/createOption.dto';
import { Option } from './entity/option.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { CurrentUserDto } from '../common/currentUser.dto';
import { OptionDto } from './dto/option.dto';
import { UpdateOptionDto } from './dto/updateOption.dto';

@Controller('options')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OptionController {
    constructor(private readonly optionService: OptionService) {}
    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() createOptionDto: CreateOptionDto): Promise<Option> {
        return this.optionService.create(createOptionDto);
    }

    @Roles('admin', 'seller', 'buyer')
    @Get('all')
    async getAll(): Promise<OptionDto[]> {
        return this.optionService.getAll();
    }

    @Roles('admin', 'seller', 'buyer')
    @Get('size/:id')
    async getOptionsBySize(@Param('id') sizeId: string): Promise<OptionDto[]> {
        return this.optionService.getOptionsBySize(sizeId);
    }

    @Delete('delete/:id')
    @Roles('admin', 'seller')
    async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
        return this.optionService.delete(id, user);
    }

    @Put('update/:id')
    @Roles('admin', 'seller')
    async update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto, @CurrentUser() user: CurrentUserDto) {
        return this.optionService.update(id, updateOptionDto, user);
    }
}
