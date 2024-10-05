import { Body, Controller, Post, Get, UseGuards, Param} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/createOption.dto';
import { Option } from './entity/option.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('options')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OptionController {
    constructor(private readonly optionService: OptionService) {}
    @Roles('admin', 'seller')
    @Post('create')
    async create(@Body() CreateOptionDto: CreateOptionDto): Promise<Option> {
        return this.optionService.create(CreateOptionDto);
    }

    @Roles('admin', 'seller', 'buyer')
    @Get()
    async getAll(): Promise<Option[]> {
        return this.optionService.getAll();
    }

    @Roles('admin', 'seller', 'buyer')
    @Get('size/:id')
    async getOptionsBySize(@Param('id') sizeId: string): Promise<Option[]> {
        return this.optionService.getOptionsBySize(sizeId);
    }
}
