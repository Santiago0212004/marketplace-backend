import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entity/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { Option } from 'src/option/entity/option.entity';
import { OptionModule } from 'src/option/option.module';

@Module({
    imports: [TypeOrmModule.forFeature([Unit, Option]), OptionModule],
    exports: [TypeOrmModule],
    controllers: [UnitController],
    providers: [UnitService],
})
export class UnitModule {}
