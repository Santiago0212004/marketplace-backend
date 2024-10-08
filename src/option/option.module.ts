import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entity/option.entity';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { Size } from 'src/size/entity/size.entity';
import { SizeModule } from 'src/size/size.module';

@Module({
    imports: [TypeOrmModule.forFeature([Option, Size]), SizeModule],
    exports: [TypeOrmModule],
    controllers: [OptionController],
    providers: [OptionService],
})
export class OptionModule {}
